import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { QueryParamsDto } from 'src/call-records/dto/query-params.dto';
import { Prisma } from '@prisma/client';
import * as xlsx from 'xlsx';
import * as PDFDocument from 'pdfkit';

@Injectable()
export class ExportService {
  constructor(private prisma: PrismaService) {}

  async exportToExcel(queryParams: QueryParamsDto): Promise<Buffer> {
    const { search, status, urgencyLevelId, dealershipId } = queryParams;
    const where: Prisma.CallRecordWhereInput = {};
    if (search) where.OR = [{ contactName: { contains: search } }, { machineSerialNumber: { contains: search } }];
    if (status) where.status = status;
    if (urgencyLevelId) where.urgencyLevelId = urgencyLevelId;
    if (dealershipId) where.dealershipId = dealershipId;

    const records = await this.prisma.callRecord.findMany({
      where,
      include: { businessUnit: true, callerType: true, dealership: true, urgencyLevel: true, createdByUser: true },
      orderBy: { createdAt: 'desc' },
    });

    const dataForExcel = records.map(record => ({
      'ID Registro': record.id,
      'Fecha Creación': new Date(record.createdAt).toLocaleDateString('es-AR'),
      'Unidad de Negocio': record.businessUnit.name,
      'Estado': record.status,
      'Nombre Contacto': record.contactName,
      'Tipo de Llamante': record.callerType?.name || 'N/A',
      'Concesionario': record.dealership?.name || 'N/A',
      'Nivel de Urgencia': record.urgencyLevel?.name || 'N/A',
      'Creado Por': record.createdByUser.name,
      'Observaciones': record.observations,
    }));

    const worksheet = xlsx.utils.json_to_sheet(dataForExcel);
    const workbook = xlsx.utils.book_new();
    xlsx.utils.book_append_sheet(workbook, worksheet, 'Registros');
    return xlsx.write(workbook, { type: 'buffer', bookType: 'xlsx' });
  }

  // --- MÉTODO DE EXPORTACIÓN A PDF MEJORADO ---
  async exportToPdf(queryParams: QueryParamsDto): Promise<Buffer> {
    const { search, status, urgencyLevelId, dealershipId } = queryParams;
    const where: Prisma.CallRecordWhereInput = {};
    if (search) where.OR = [{ contactName: { contains: search} }, { machineSerialNumber: { contains: search } }];
    if (status) where.status = status;
    if (urgencyLevelId) where.urgencyLevelId = urgencyLevelId;
    if (dealershipId) where.dealershipId = dealershipId;
    
    const records = await this.prisma.callRecord.findMany({ 
      where, 
      include: { dealership: true, createdByUser: true }, // Incluimos las relaciones necesarias
      orderBy: { createdAt: 'desc' } 
    });

    const doc = new PDFDocument({ margin: 40, size: 'A4' });

    // --- Funciones de ayuda para el diseño del PDF ---
    const generateHeader = (doc: PDFKit.PDFDocument) => {
      doc
        .fillColor('#D71920')
        .fontSize(20)
        .text('Reporte de Registros', { align: 'center' })
        .fontSize(10)
        .fillColor('#333333')
        .text(`Fecha de Emisión: ${new Date().toLocaleDateString('es-AR')}`, { align: 'center' })
        .moveDown(2);
    };
    
    const generateFooter = (doc: PDFKit.PDFDocument) => {
        const range = doc.bufferedPageRange();
        for (let i = range.start; i < range.start + range.count; i++) {
            doc.switchToPage(i);
            doc.fontSize(8).fillColor('grey').text(`Página ${i + 1} de ${range.count}`, 40, doc.page.height - 35, { align: 'center', width: doc.page.width - 80 });
        }
    };

    // --- Generación del contenido del PDF ---
    generateHeader(doc);
    
    const statusTranslations: { [key: string]: string } = {
        OPEN: 'Abierto',
        IN_PROGRESS: 'En Progreso',
        CLOSED: 'Cerrado',
        PENDING_CLIENT: 'Pendiente'
    };
    
    const columnWidth = (doc.page.width - doc.page.margins.left - doc.page.margins.right) / 5;
    const tableTop = 150;

    const drawTableHeader = () => {
        let x = doc.page.margins.left;
        doc.font('Helvetica-Bold').fontSize(9);
        ['Fecha', 'Contacto', 'Concesionario', 'Estado', 'Creado Por'].forEach(header => {
            doc.text(header, x, tableTop, { width: columnWidth, align: 'left' });
            x += columnWidth;
        });
        doc.moveTo(doc.page.margins.left, tableTop + 15).lineTo(doc.page.width - doc.page.margins.right, tableTop + 15).strokeColor('#aaaaaa').stroke();
    }

    drawTableHeader();

    let y = tableTop + 25;
    doc.font('Helvetica').fontSize(9);

    for (const record of records) {
        const rowHeight = 60; // Altura estimada por fila incluyendo observaciones
        if (y + rowHeight > doc.page.height - doc.page.margins.bottom) { // Salto de página
            doc.addPage();
            generateHeader(doc);
            drawTableHeader();
            y = tableTop + 25;
            doc.font('Helvetica').fontSize(9);
        }

        let x = doc.page.margins.left;
        doc.text(new Date(record.createdAt).toLocaleDateString('es-AR'), x, y, { width: columnWidth });
        x += columnWidth;
        doc.text(record.contactName, x, y, { width: columnWidth });
        x += columnWidth;
        doc.text(record.dealership?.name || 'N/A', x, y, { width: columnWidth });
        x += columnWidth;
        doc.text(statusTranslations[record.status] || record.status, x, y, { width: columnWidth });
        x += columnWidth;
        doc.text(record.createdByUser.name, x, y, { width: columnWidth });
        
        y += 25; // Espacio para las observaciones

        if (record.observations) {
            doc.font('Helvetica-Oblique').fontSize(8).fillColor('#555555');
            doc.text(`Obs: ${record.observations}`, doc.page.margins.left, y, {
                width: doc.page.width - doc.page.margins.left - doc.page.margins.right,
                align: 'left'
            });
            y += 25; // Espacio extra si hay observaciones
        }
        
        doc.moveTo(doc.page.margins.left, y).lineTo(doc.page.width - doc.page.margins.right, y).strokeColor('#eeeeee').stroke();
        y += 10;
    }
    
    generateFooter(doc);
    doc.end();

    const buffers: Buffer[] = [];
    doc.on('data', buffers.push.bind(buffers));
    return new Promise((resolve) => {
        doc.on('end', () => resolve(Buffer.concat(buffers)));
    });
  }
}
