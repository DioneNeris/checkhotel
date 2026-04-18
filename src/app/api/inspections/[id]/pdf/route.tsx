import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { renderToStream } from "@react-pdf/renderer";
import React from "react";
import { Document, Page, Text, View, StyleSheet, Font, Image } from "@react-pdf/renderer";

// Clean, Professional PDF Theme
const styles = StyleSheet.create({
  page: { 
    padding: 40, 
    fontFamily: "Helvetica",
    backgroundColor: "#ffffff"
  },
  headerContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    borderBottom: "2pt solid #2563eb", // Professional Blue Accent
    paddingBottom: 15,
    marginBottom: 30,
  },
  brandName: { 
    fontSize: 22, 
    fontFamily: "Helvetica-Bold",
    color: "#0f172a", 
    letterSpacing: -0.5
  },
  reportType: {
    fontSize: 9,
    color: "#2563eb",
    fontFamily: "Helvetica-Bold",
    letterSpacing: 1,
    marginTop: 4,
    textTransform: "uppercase"
  },
  metaContainer: {
    marginBottom: 30,
    padding: 15,
    backgroundColor: "#f8fafc",
    borderRadius: 6,
    flexDirection: "row",
    flexWrap: "wrap",
    border: "0.5pt solid #e2e8f0"
  },
  metaItem: {
    width: "50%",
    marginBottom: 8
  },
  metaLabel: {
    fontSize: 7,
    color: "#64748b",
    textTransform: "uppercase",
    marginBottom: 2,
    fontFamily: "Helvetica-Bold"
  },
  metaValue: {
    fontSize: 11,
    color: "#0f172a",
    fontFamily: "Helvetica"
  },
  sectionTitle: {
    fontSize: 12,
    fontFamily: "Helvetica-Bold",
    color: "#0f172a",
    marginBottom: 10,
    paddingBottom: 4,
    borderBottom: "1pt solid #f1f5f9"
  },
  table: {
    display: "flex",
    width: "auto",
    marginBottom: 20
  },
  tableRow: {
    flexDirection: "row",
    borderBottomColor: "#f1f5f9",
    borderBottomWidth: 1,
    minHeight: 30,
    alignItems: "center"
  },
  tableHeader: {
    backgroundColor: "#f8fafc",
    borderBottomWidth: 2,
    borderBottomColor: "#e2e8f0",
    minHeight: 25
  },
  colDescription: { width: "70%", paddingLeft: 8 },
  colStatus: { width: "30%", paddingLeft: 8 },
  headerText: { fontSize: 8, color: "#475569", fontFamily: "Helvetica-Bold" },
  cellText: { fontSize: 9, color: "#1e293b" },
  cellStatusOk: { color: "#059669", fontFamily: "Helvetica-Bold" },
  cellStatusIssue: { color: "#dc2626", fontFamily: "Helvetica-Bold" },
  obsContainer: {
    marginTop: 4,
    padding: 8,
    backgroundColor: "#fff1f2",
    borderRadius: 4,
    borderLeft: "2pt solid #fb7185",
    marginLeft: 8,
    marginBottom: 8
  },
  obsLabel: { fontSize: 7, color: "#be123c", marginBottom: 2, fontFamily: "Helvetica-Bold" },
  obsText: { fontSize: 8, color: "#4c0519" },
  footer: {
    position: "absolute",
    bottom: 30,
    left: 40,
    right: 40,
    borderTop: "0.5pt solid #e2e8f0",
    paddingTop: 15,
    flexDirection: "row",
    justifyContent: "space-between"
  },
  footerText: { fontSize: 7, color: "#94a3b8", fontFamily: "Helvetica" }
});

const InspectionDocument = ({ inspection }: { inspection: any }) => (
  <Document title={`Relatorio-${inspection.room.number}`}>
    <Page size="A4" style={styles.page}>
      {/* Header */}
      <View style={styles.headerContainer}>
        <View>
          <Text style={styles.brandName}>CheckHotel</Text>
          <Text style={styles.reportType}>Relatório Técnico de Inspeção</Text>
        </View>
        <View>
          <Text style={{ fontSize: 8, color: "#94a3b8" }}>Protocolo: {inspection.id.slice(0, 12).toUpperCase()}</Text>
        </div >
      </View>

      {/* Meta Information */}
      <View style={styles.metaContainer}>
        <View style={styles.metaItem}>
          <Text style={styles.metaLabel}>Unidade / Quarto</Text>
          <Text style={styles.metaValue}>{inspection.room.number}</Text>
        </View>
        <View style={styles.metaItem}>
          <Text style={styles.metaLabel}>Data da Vistoria</Text>
          <Text style={styles.metaValue}>{new Date(inspection.date).toLocaleDateString("pt-BR")}</Text>
        </View>
        <View style={styles.metaItem}>
          <Text style={styles.metaLabel}>Status Final</Text>
          <Text style={[styles.metaValue, { color: inspection.status === "APPROVED" ? "#059669" : "#dc2626", fontWeight: "bold" }]}>
            {inspection.status === "APPROVED" ? "APROVADO PARA USO" : "MANUTENÇÃO REQUERIDA"}
          </Text>
        </View>
        <View style={styles.metaItem}>
          <Text style={styles.metaLabel}>ID do Auditor</Text>
          <Text style={styles.metaValue}>{inspection.userId.slice(0, 10).toUpperCase()}</Text>
        </View>
      </View>

      {/* Items Table */}
      <Text style={styles.sectionTitle}>Resultados do Checklist</Text>
      <View style={styles.table}>
        <View style={[styles.tableRow, styles.tableHeader]}>
          <View style={styles.colDescription}><Text style={styles.headerText}>ITEM DE VERIFICAÇÃO</Text></View>
          <View style={styles.colStatus}><Text style={styles.headerText}>RESULTADO</Text></View>
        </View>

        {inspection.items.map((item: any) => (
          <View key={item.id} wrap={false}>
            <View style={styles.tableRow}>
              <View style={styles.colDescription}>
                <Text style={styles.cellText}>{item.checklistItem.description}</Text>
              </View>
              <View style={styles.colStatus}>
                <Text style={[styles.cellText, item.status === "OK" ? styles.cellStatusOk : styles.cellStatusIssue]}>
                  {item.status === "OK" ? "CONFORME" : "NÃO CONFORME"}
                </Text>
              </View>
            </View>
            {item.observation && (
              <View style={styles.obsContainer}>
                <Text style={styles.obsLabel}>DETALHES DA NÃO CONFORMIDADE:</Text>
                <Text style={styles.obsText}>{item.observation}</Text>
              </View>
            )}
          </View>
        ))}
      </View>

      {/* Footer */}
      <View style={styles.footer}>
        <Text style={styles.footerText}>Sistema CheckHotel - Gestão Inteligente de Hospitalidade</Text>
        <Text style={styles.footerText}>Relatório gerado digitalmente.</Text>
      </View>
    </Page>
  </Document>
);

export async function GET(req: Request, { params }: { params: { id: string } }) {
  try {
    const inspection = await prisma.inspection.findUnique({
      where: { id: params.id },
      include: {
        room: true,
        items: {
          include: { checklistItem: true }
        }
      }
    });

    if (!inspection) {
      return NextResponse.json({ error: "Not found" }, { status: 404 });
    }

    const stream = await renderToStream(<InspectionDocument inspection={inspection} />);
    
    return new NextResponse(stream as any, {
      headers: {
        "Content-Type": "application/pdf",
        "Content-Disposition": `inline; filename="vistoria-${inspection.room.number}.pdf"`,
      },
    });

  } catch (error) {
    console.error("PDF generation error:", error);
    return NextResponse.json({ error: "Failed to generate PDF" }, { status: 500 });
  }
}
