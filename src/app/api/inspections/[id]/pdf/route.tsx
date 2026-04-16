import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { renderToStream } from "@react-pdf/renderer";
import React from "react";
import { Document, Page, Text, View, StyleSheet } from "@react-pdf/renderer";

const styles = StyleSheet.create({
  page: { padding: 30, fontFamily: "Helvetica" },
  header: { fontSize: 24, marginBottom: 20, textAlign: "center", color: "#1e293b", fontWeight: "bold" },
  subHeader: { fontSize: 14, marginBottom: 10, color: "#475569" },
  itemContainer: { marginBottom: 10, padding: 10, borderBottom: "1pt solid #e2e8f0" },
  itemTitle: { fontSize: 12, fontWeight: "bold", color: "#0f172a" },
  itemStatus: { fontSize: 12, marginTop: 4 },
  itemObs: { fontSize: 10, color: "#ef4444", marginTop: 4, fontStyle: "italic" },
});

const InspectionDocument = ({ inspection }: { inspection: any }) => (
  <Document>
    <Page size="A4" style={styles.page}>
      <Text style={styles.header}>Relatório de Vistoria - CheckHotel</Text>
      <Text style={styles.subHeader}>Quarto: {inspection.room.number}</Text>
      <Text style={styles.subHeader}>Data: {new Date(inspection.date).toLocaleDateString("pt-BR")}</Text>
      <Text style={styles.subHeader}>Status Final: {inspection.status}</Text>

      <View style={{ marginTop: 20 }}>
        {inspection.items.map((item: any) => (
          <View key={item.id} style={styles.itemContainer}>
            <Text style={styles.itemTitle}>{item.checklistItem.description}</Text>
            <Text style={{ ...styles.itemStatus, color: item.status === "OK" ? "#10b981" : "#ef4444" }}>
              Status: {item.status === "OK" ? "Aprovado" : "Problema Encontrado"}
            </Text>
            {item.observation && <Text style={styles.itemObs}>Observação: {item.observation}</Text>}
          </View>
        ))}
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
