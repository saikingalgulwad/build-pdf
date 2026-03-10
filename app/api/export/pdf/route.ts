import PDFDocument from 'pdfkit';
import { getServerSession } from 'next-auth';

import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

export async function GET(request: Request) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    return new Response('Unauthorized', { status: 401 });
  }

  const url = new URL(request.url);
  const chapterId = url.searchParams.get('chapterId');
  if (!chapterId) {
    return new Response('chapterId is required', { status: 400 });
  }

  const chapter = await prisma.chapter.findFirst({
    where: { id: chapterId, userId: session.user.id },
    include: { conversations: { orderBy: { createdAt: 'asc' } } }
  });

  if (!chapter) {
    return new Response('Chapter not found', { status: 404 });
  }

  const doc = new PDFDocument({ margin: 50 });
  const chunks: Buffer[] = [];

  doc.on('data', (chunk) => chunks.push(chunk as Buffer));

  doc.fontSize(20).text(`Chapter: ${chapter.name}`);
  doc.moveDown(1);

  chapter.conversations.forEach((item, index) => {
    doc.fontSize(14).fillColor('#1d4ed8').text(`${index + 1}. ${item.title}`);
    doc.fontSize(10).fillColor('gray').text(`Saved: ${item.createdAt.toISOString()}`);
    doc.moveDown(0.4);
    doc.fontSize(12).fillColor('black').text(`Question: ${item.question}`);
    doc.moveDown(0.3);
    doc.fontSize(12).text(`Answer: ${item.answer}`);
    doc.moveDown(1);
  });

  doc.end();

  await new Promise<void>((resolve) => doc.on('end', () => resolve()));
  const pdfBuffer = Buffer.concat(chunks);

  return new Response(pdfBuffer, {
    headers: {
      'Content-Type': 'application/pdf',
      'Content-Disposition': `attachment; filename="${chapter.name.replace(/\s+/g, '_')}.pdf"`
    }
  });
}
