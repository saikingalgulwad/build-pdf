import bcrypt from 'bcryptjs';
import { NextResponse } from 'next/server';
import { z } from 'zod';

import { prisma } from '@/lib/prisma';

const schema = z.object({
  email: z.string().email(),
  password: z.string().min(6)
});

export async function POST(request: Request) {
  const payload = schema.safeParse(await request.json());
  if (!payload.success) {
    return NextResponse.json({ error: 'Invalid request body.' }, { status: 400 });
  }

  const existing = await prisma.user.findUnique({ where: { email: payload.data.email } });
  if (existing) {
    return NextResponse.json({ error: 'Email already exists.' }, { status: 409 });
  }

  const hashed = await bcrypt.hash(payload.data.password, 10);

  const user = await prisma.user.create({
    data: { email: payload.data.email, password: hashed },
    select: { id: true, email: true, createdAt: true }
  });

  return NextResponse.json(user, { status: 201 });
}
