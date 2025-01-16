"use server";
import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";
import { z } from "zod";

const schemaRegister = z.object({
    username: z.string().min(3).max(20, {
      message: "Username must be between 3 and 20 characters",
    }),
    password: z.string().min(6).max(100, {
      message: "Password must be between 6 and 100 characters",
    }),
    email: z.string().email({
      message: "Please enter a valid email address",
    }),
  });


  
  const prisma = new PrismaClient();
  
  export async function registerUserAction(prevState: any, formData: FormData) {
    const validatedFields = schemaRegister.safeParse({
      username: formData.get("username"),
      password: formData.get("password"),
      email: formData.get("email"),
    });
  
    if (!validatedFields.success) {
      return {
        ...prevState,
        zodErrors: validatedFields.error.flatten().fieldErrors,
        strapiErrors: null,
        message: "Missing Fields. Failed to Register.",
      };
    }
  
    const hashedPassword = await bcrypt.hash(formData.get("password") as string, 10);
  
    // Zapisywanie użytkownika w bazie danych
    try {
      const user = await prisma.user.create({
        data: {
          username: formData.get("username") as string,
          email: formData.get("email") as string,
          password: hashedPassword,
        },
      });
  
      return {
        ...prevState,
        data: user,
      };
    } catch (error) {
      return {
        ...prevState,
        message: "Error creating user.",
      };
    }
  }
  