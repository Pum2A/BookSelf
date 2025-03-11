import { NextRequest, NextResponse } from "next/server";
import { jwtVerify } from "jose";
import { cookies } from "next/headers";
import { writeFile, mkdir } from "fs/promises";
import { join } from "path";
import { existsSync } from "fs";
import prisma from "@/app/lib/prisma";
const secret = new TextEncoder().encode(
  process.env.JWT_SECRET || "default_secret_key"
);
const ITEMS_PER_PAGE = 6;

interface JwtPayload {
  userId: number;
  role: string;
  iat: number;
  exp: number;
}

export async function GET(request: NextRequest) {
  try {
    const token = (await cookies()).get("token")?.value;

    if (!token) {
      return NextResponse.json(
        { success: false, message: "Brak tokenu. Musisz być zalogowany." },
        { status: 401 }
      );
    }

    // Weryfikacja tokenu
    let payload: JwtPayload;
    try {
      const verifyResult = await jwtVerify(token, secret);
      if (!verifyResult.payload || typeof verifyResult.payload !== "object") {
        throw new Error("Invalid token payload");
      }
      payload = verifyResult.payload as unknown as JwtPayload;

      // Validate that required fields exist
      if (!payload.userId || !payload.role) {
        throw new Error("Missing required token fields");
      }
    } catch (error) {
      console.error("Token verification error:", error);
      return NextResponse.json(
        { success: false, message: "Nieprawidłowy lub wygasły token." },
        { status: 401 }
      );
    }

    const searchParams = request.nextUrl.searchParams;
    const page = Number(searchParams.get("page")) || 1;
    const searchTerm = searchParams.get("search") || "";
    const category = searchParams.get("category") || "all";

    // Prepare the where condition
    let where: any = {};

    // Add owner filter if role is OWNER
    if (payload.role === "OWNER") {
      where.ownerId = payload.userId;
    }

    // Add search condition if searchTerm exists
    if (searchTerm) {
      where.OR = [
        { name: { contains: searchTerm, mode: "insensitive" } },
        { description: { contains: searchTerm, mode: "insensitive" } },
      ];
    }

    // Add category filter if not "all"
    if (category !== "all") {
      where.menuItems = {
        some: {
          category: {
            equals: category,
            mode: "insensitive",
          },
        },
      };
    }

    const skip = (page - 1) * ITEMS_PER_PAGE;
    const [firms, total] = await Promise.all([
      prisma.firm.findMany({
        where,
        include: { menuItems: true },
        skip,
        take: ITEMS_PER_PAGE,
        orderBy: { createdAt: "desc" },
      }),
      prisma.firm.count({ where }),
    ]);

    const totalPages = Math.ceil(total / ITEMS_PER_PAGE);

    return NextResponse.json({
      success: true,
      data: firms,
      pagination: {
        total,
        totalPages,
        currentPage: page,
        perPage: ITEMS_PER_PAGE,
      },
    });
  } catch (error: any) {
    console.error("Błąd GET /api/firms:", error);
    return NextResponse.json(
      { success: false, message: "Błąd serwera", error: error.message },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const token = (await cookies()).get("token")?.value;

    if (!token) {
      return NextResponse.json(
        { success: false, message: "Brak tokenu. Musisz być zalogowany." },
        { status: 401 }
      );
    }

    let payload: JwtPayload;
    try {
      const verifyResult = await jwtVerify(token, secret);
      if (!verifyResult.payload || typeof verifyResult.payload !== "object") {
        throw new Error("Invalid token payload");
      }
      payload = verifyResult.payload as unknown as JwtPayload;

      if (!payload.userId || !payload.role) {
        throw new Error("Missing required token fields");
      }
    } catch (error) {
      console.error("Token verification error:", error);
      return NextResponse.json(
        { success: false, message: "Nieprawidłowy lub wygasły token." },
        { status: 401 }
      );
    }

    const formData = await request.formData();

    const requiredFields = [
      "name",
      "description",
      "location",
      "address",
      "openingHours",
    ];
    const missingFields = requiredFields.filter(
      (field) => !formData.get(field)
    );

    if (missingFields.length > 0) {
      return NextResponse.json(
        {
          success: false,
          message: "Brakujące pola",
          missing: missingFields,
        },
        { status: 400 }
      );
    }

    const name = formData.get("name") as string;
    const description = formData.get("description") as string;
    const location = formData.get("location") as string;
    const address = formData.get("address") as string;
    const openingHours = formData.get("openingHours") as string;
    const image = formData.get("image") as File | null;

    let imagePath = null;
    if (image && image.size > 0) {
      const allowedTypes = ["image/jpeg", "image/png", "image/webp"];
      if (!allowedTypes.includes(image.type)) {
        return NextResponse.json(
          { success: false, message: "Nieobsługiwany format pliku" },
          { status: 400 }
        );
      }

      if (image.size > 5 * 1024 * 1024) {
        return NextResponse.json(
          { success: false, message: "Plik jest zbyt duży (maks. 5MB)" },
          { status: 400 }
        );
      }

      const buffer = Buffer.from(await image.arrayBuffer());
      const timestamp = Date.now();
      const randomString = Math.random().toString(36).substring(2, 8);
      const extension = image.name.split(".").pop();
      const fileName = `firm_${timestamp}_${randomString}.${extension}`;
      const uploadDir = join(process.cwd(), "public", "uploads", "firms");

      if (!existsSync(uploadDir)) {
        await mkdir(uploadDir, { recursive: true });
      }

      const filePath = join(uploadDir, fileName);
      await writeFile(filePath, buffer);
      imagePath = `/uploads/firms/${fileName}`;
    }

    const newFirm = await prisma.firm.create({
      data: {
        name,
        description,
        location,
        address,
        openingHours,
        imagePath,
        ownerId: payload.userId,
      },
      include: { menuItems: true },
    });

    return NextResponse.json(
      { success: true, message: "Firma utworzona", data: newFirm },
      { status: 201 }
    );
  } catch (error: any) {
    console.error("Błąd POST /api/firms:", error);
    return NextResponse.json(
      {
        success: false,
        message: "Błąd tworzenia firmy",
        error: error.message,
      },
      { status: 500 }
    );
  }
}
