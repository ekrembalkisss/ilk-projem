import { NextRequest, NextResponse } from 'next/server';
import mammoth from 'mammoth';

export async function POST(request: NextRequest) {
  try {
    console.log('API: Processing file request...');
    const formData = await request.formData();
    const file = formData.get('file') as File;

    if (!file) {
      console.log('API: No file provided');
      return NextResponse.json({ error: 'No file provided' }, { status: 400 });
    }

    const fileName = file.name.toLowerCase();
    const fileType = file.type;
    console.log('API: File received:', fileName, 'Type:', fileType, 'Size:', file.size);
    let content = '';

    // Handle .docx files with mammoth
    if (
      fileType === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document' ||
      fileName.endsWith('.docx')
    ) {
      console.log('API: Processing .docx file with mammoth');
      const arrayBuffer = await file.arrayBuffer();
      // Convert ArrayBuffer to Buffer for Node.js mammoth
      const buffer = Buffer.from(arrayBuffer);
      console.log('API: Buffer created, size:', buffer.length);
      const result = await mammoth.extractRawText({ buffer });
      content = result.value;
      console.log('API: Mammoth extracted', content.length, 'characters');

      if (!content || content.trim().length === 0) {
        return NextResponse.json(
          { error: 'Could not extract text from .docx file. The file may be empty or corrupted.' },
          { status: 400 }
        );
      }
    }
    // Handle .doc files (older Word format)
    else if (fileType === 'application/msword' || fileName.endsWith('.doc')) {
      // .doc files are not well supported without additional libraries
      // Return a helpful message
      return NextResponse.json(
        { error: 'Old .doc format is not fully supported. Please save as .docx or .txt' },
        { status: 400 }
      );
    }
    // Handle PDF files
    else if (fileType === 'application/pdf' || fileName.endsWith('.pdf')) {
      // Basic PDF handling - recommend manual copy
      return NextResponse.json(
        { error: 'PDF text extraction is limited. Please copy the text content manually and use "Paste Text" option.' },
        { status: 400 }
      );
    }
    // Handle text-based files
    else {
      const text = await file.text();
      content = text;
    }

    return NextResponse.json({
      success: true,
      content,
      fileName: file.name,
      wordCount: content.split(/\s+/).filter(Boolean).length,
    });

  } catch (error) {
    console.error('File processing error:', error);
    return NextResponse.json(
      { error: 'Failed to process file. Please try a different format.' },
      { status: 500 }
    );
  }
}
