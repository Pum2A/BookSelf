import { NextRequest, NextResponse } from "next/server";
import { jwtVerify } from "jose";
import { cookies } from "next/headers";
import { PrismaClient } from "@prisma/client";
import { put } from "@vercel/blob";

const prisma = new PrismaClient();
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
    const cookieStore = cookies();
    const token = (await cookieStore).get("token")?.value;

    if (!token) {
      return NextResponse.json(
        { success: false, message: "Brak tokenu. Musisz być zalogowany." },
        { status: 401 }
      );
    }

    let payload: JwtPayload;
    try {
      const { payload: verifiedPayload } = await jwtVerify(token, secret);
      payload = verifiedPayload as unknown as JwtPayload;
    } catch (error) {
      return NextResponse.json(
        { success: false, message: "Nieprawidłowy lub wygasły token." },
        { status: 401 }
      );
    }

    const searchParams = request.nextUrl.searchParams;
    const page = Number(searchParams.get("page")) || 1;
    const searchTerm = searchParams.get("search") || "";
    const category = searchParams.get("category") || "all";

    const where: any = {
      AND: [],
      ...(payload.role === "OWNER" && { ownerId: payload.userId }),
    };

    if (searchTerm) {
      where.AND.push({
        OR: [
          { name: { contains: searchTerm, mode: "insensitive" } },
          { description: { contains: searchTerm, mode: "insensitive" } },
        ],
      });
    }

    if (category !== "all") {
      where.AND.push({
        menuItems: {
          some: {
            category: {
              equals: category,
              mode: "insensitive",
            },
          },
        },
      });
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
    const cookieStore = cookies();
    const token = (await cookieStore).get("token")?.value;

    if (!token) {
      return NextResponse.json(
        { success: false, message: "Brak tokenu. Musisz być zalogowany." },
        { status: 401 }
      );
    }

    let payload: JwtPayload;
    try {
      const { payload: verifiedPayload } = await jwtVerify(token, secret);
      payload = verifiedPayload as unknown as JwtPayload;
      if (!payload?.userId || !payload?.role) {
        throw new Error("Nieprawidłowy token");
      }
    } catch (error) {
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

    let imageUrl = null;
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

      const blob = await put(`firm-${Date.now()}-${image.name}`, image, {
        access: "public",
        token: process.env.BLOB_READ_WRITE_TOKEN,
      });
      imageUrl = blob.url;
    }

    const newFirm = await prisma.firm.create({
      data: {
        name,
        description,
        location,
        address,
        openingHours,
        imagePath: imageUrl,
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

export async function DELETE(request: NextRequest){
  const cookieStore = cookies();
  const token = (await cookieStore).get("token")?.value;

  if (!token) {
    return NextResponse.json(
      { success: false, message: "Brak tokenu. Musisz być zalogowany." },
      { status: 401 }
    );
  }

  let payload: JwtPayload;
  try {
    const { payload: verifiedPayload } = await jwtVerify(token, secret);
    payload = verifiedPayload as unknown as JwtPayload;
  } catch (error) {
    return NextResponse.json(
      { success: false, message: "Nieprawidłowy lub wygasły token." },
      { status: 401 }
    );
  }
}
