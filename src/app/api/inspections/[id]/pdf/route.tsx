import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { renderToStream } from "@react-pdf/renderer";
import React from "react";
import { Document, Page, Text, View, StyleSheet, Font, Image } from "@react-pdf/renderer";

// Note: Standard PDF fonts are used to avoid complex registration without font files.
// Times-Bold gives a more "Executive/Hospitality" feel than Helvetica.

const styles = StyleSheet.create({
  page: { 
    padding: 40, 
    fontFamily: "Times-Roman",
    backgroundColor: "#ffffff"
  },
  headerContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    borderBottom: "2pt solid #c5a059", // Gold Accent
    paddingBottom: 15,
    marginBottom: 30,
  },
  brandName: { 
    fontSize: 24, 
    fontFamily: "Times-Bold",
    color: "#1a1a1a", 
    letterSpacing: 1
  },
  reportType: {
    fontSize: 10,
    color: "#c5a059",
    fontFamily: "Helvetica-Bold",
    letterSpacing: 2,
    marginTop: 4,
    textTransform: "uppercase"
  },
  metaContainer: {
    marginBottom: 40,
    padding: 20,
    backgroundColor: "#f9f9f9",
    borderRadius: 8,
    flexDirection: "row",
    flexWrap: "wrap",
    border: "1pt solid #eeeeee"
  },
  metaItem: {
    width: "50%",
    marginBottom: 10
  },
  metaLabel: {
    fontSize: 8,
    color: "#999999",
    textTransform: "uppercase",
    marginBottom: 2,
    fontFamily: "Helvetica"
  },
  metaValue: {
    fontSize: 12,
    color: "#1a1a1a",
    fontFamily: "Times-Bold"
  },
  sectionTitle: {
    fontSize: 14,
    fontFamily: "Times-Bold",
    color: "#1a1a1a",
    marginBottom: 15,
    paddingBottom: 5,
    borderBottom: "1pt solid #eeeeee"
  },
  table: {
    display: "flex",
    width: "auto",
    marginBottom: 30
  },
  tableRow: {
    flexDirection: "row",
    borderBottomColor: "#eeeeee",
    borderBottomWidth: 1,
    minHeight: 35,
    alignItems: "center"
  },
  tableHeader: {
    backgroundColor: "#1a1a1a",
    color: "#ffffff",
    fontFamily: "Helvetica-Bold",
    fontSize: 9,
    height: 25
  },
  colDescription: { width: "60%", paddingLeft: 10 },
  colStatus: { width: "40%", paddingLeft: 10 },
  cellText: { fontSize: 10, color: "#333333" },
  cellStatusOk: { color: "#10b981", fontFamily: "Helvetica-Bold" },
  cellStatusIssue: { color: "#ef4444", fontFamily: "Helvetica-Bold" },
  obsContainer: {
    marginTop: 5,
    paddingLeft: 10,
    paddingBottom: 10
  },
  obsLabel: { fontSize: 8, color: "#ef4444", marginBottom: 2, fontFamily: "Helvetica-BoldOblique" },
  obsText: { fontSize: 9, color: "#666666", fontStyle: "italic" },
  footer: {
    position: "absolute",
    bottom: 40,
    left: 40,
    right: 40,
    borderTop: "1pt solid #eeeeee",
    paddingTop: 20,
    flexDirection: "row",
    justifyContent: "space-between"
  },
  footerText: { fontSize: 8, color: "#999999", fontFamily: "Helvetica" },
  seal: {
    width: 60,
    height: 60,
    border: "2pt solid #c5a059",
    borderRadius: 30,
    justifyContent: "center",
    alignItems: "center",
    opacity: 0.3
  },
  sealText: { fontSize: 8, color: "#c5a059", fontFamily: "Helvetica-Bold", textAlign: "center" }
});

const InspectionDocument = ({ inspection }: { inspection: any }) => (
  <Document title={`Relatorio-${inspection.room.number}`}>
    <Page size="A4" style={styles.page}>
      {/* Header */}
      <View style={styles.headerContainer}>
        <View>
          <Text style={styles.brandName}>CheckHotel</Text>
          <Text style={styles.reportType}>Vistoria Executiva de Quarto</Text>
        </View>
        <View style={styles.seal}>
          <Text style={styles.sealText}>QUALITY{"\n"}ASSURED</Text>
        </View>
      </View>

      {/* Meta Information */}
      <View style={styles.metaContainer}>
        <View style={styles.metaItem}>
          <Text style={styles.metaLabel}>Unidade / Quarto</Text>
          <Text style={styles.metaValue}>{inspection.room.number}</Text>
        </View>
        <View style={styles.metaItem}>
          <Text style={styles.metaLabel}>Data da Emissão</Text>
          <Text style={styles.metaValue}>{new Date(inspection.date).toLocaleDateString("pt-BR")}</Text>
        </View>
        <View style={styles.metaItem}>
          <Text style={styles.metaLabel}>Responsável (ID)</Text>
          <Text style={styles.metaValue}>{inspection.userId.slice(0, 8)}</Text>
        </View>
        <View style={styles.metaItem}>
          <Text style={styles.metaLabel}>Classificação Final</Text>
          <Text style={[styles.metaValue, { color: inspection.status === "APPROVED" ? "#10b981" : "#ef4444" }]}>
            {inspection.status === "APPROVED" ? "APROVADO" : "COM PENDÊNCIAS"}
          </Text>
        </View>
      </View>

      {/* Items Table */}
      <Text style={styles.sectionTitle}>Checklist de Inspeção</Text>
      <View style={styles.table}>
        <View style={[styles.tableRow, styles.tableHeader]}>
          <View style={styles.colDescription}><Text style={{ color: "white" }}>ITEM ANALISADO</Text></View>
          <View style={styles.colStatus}><Text style={{ color: "white" }}>STATUS</Text></View>
        </View>

        {inspection.items.map((item: any) => (
          <View key={item.id}>
            <View style={styles.tableRow}>
              <View style={styles.colDescription}>
                <Text style={styles.cellText}>{item.checklistItem.description}</Text>
              </View>
              <View style={styles.colStatus}>
                <Text style={[styles.cellText, item.status === "OK" ? styles.cellStatusOk : styles.cellStatusIssue]}>
                  {item.status === "OK" ? "✓ APROVADO" : "✗ PROBLEMA"}
                </Text>
              </View>
            </View>
            {item.observation && (
              <View style={styles.obsContainer}>
                <Text style={styles.obsLabel}>OBSERVAÇÃO TÉCNICA:</Text>
                <Text style={styles.obsText}>{item.observation}</Text>
              </View>
            )}
          </View>
        ))}
      </View>

      {/* Footer */}
      <View style={styles.footer}>
        <Text style={styles.footerText}>Gerado automaticamente pelo Sistema CheckHotel Elite - Documento oficial interno.</Text>
        <Text style={styles.footerText}>Página 1 de 1</Text>
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
          include: { checklistItem: true, photos: true }
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
        "Content-Disposition": `attachment; filename="vistoria-${inspection.room.number}.pdf"`,
      },
    });

  } catch (error) {
    console.error("PDF generation error:", error);
    return NextResponse.json({ error: "Failed to generate PDF" }, { status: 500 });
  }
}
