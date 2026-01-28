"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import { ArrowLeft, Download, Plus, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface LineItem {
  id: string;
  description: string;
  qty: number;
  rate: number;
}

export default function InvoiceCraft() {
  const [fromName, setFromName] = useState("");
  const [fromAddress, setFromAddress] = useState("");
  const [toName, setToName] = useState("");
  const [toAddress, setToAddress] = useState("");
  const [invoiceNumber, setInvoiceNumber] = useState(`INV-${Math.floor(Math.random() * 9000) + 1000}`);
  const [invoiceDate, setInvoiceDate] = useState(new Date().toISOString().split("T")[0]);
  const [dueDate, setDueDate] = useState(() => {
    const d = new Date();
    d.setDate(d.getDate() + 30);
    return d.toISOString().split("T")[0];
  });
  const [currency, setCurrency] = useState("$");
  const [taxRate, setTaxRate] = useState(0);
  const [discount, setDiscount] = useState(0);
  const [notes, setNotes] = useState("");
  const [lineItems, setLineItems] = useState<LineItem[]>([
    { id: "1", description: "", qty: 1, rate: 0 },
  ]);

  const addLineItem = () => {
    setLineItems([
      ...lineItems,
      { id: Date.now().toString(), description: "", qty: 1, rate: 0 },
    ]);
  };

  const removeLineItem = (id: string) => {
    if (lineItems.length > 1) {
      setLineItems(lineItems.filter((item) => item.id !== id));
    }
  };

  const updateLineItem = (id: string, field: keyof LineItem, value: string | number) => {
    setLineItems(
      lineItems.map((item) =>
        item.id === id ? { ...item, [field]: value } : item
      )
    );
  };

  const totals = useMemo(() => {
    const subtotal = lineItems.reduce((sum, item) => sum + item.qty * item.rate, 0);
    const taxable = subtotal - discount;
    const tax = taxable * (taxRate / 100);
    const total = taxable + tax;
    return { subtotal, tax, total };
  }, [lineItems, taxRate, discount]);

  const formatDate = (dateStr: string) => {
    if (!dateStr) return "";
    return new Date(dateStr).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  const downloadPDF = async () => {
    // Dynamic import jsPDF
    const { jsPDF } = await import("jspdf");
    const doc = new jsPDF();

    // Header
    doc.setFontSize(24);
    doc.setTextColor(102, 126, 234);
    doc.text("INVOICE", 20, 25);

    doc.setFontSize(10);
    doc.setTextColor(100);
    doc.text(invoiceNumber, 190, 20, { align: "right" });
    doc.text(`Date: ${formatDate(invoiceDate)}`, 190, 26, { align: "right" });
    doc.text(`Due: ${formatDate(dueDate)}`, 190, 32, { align: "right" });

    // From
    doc.setFontSize(8);
    doc.setTextColor(150);
    doc.text("FROM", 20, 45);
    doc.setFontSize(11);
    doc.setTextColor(50);
    doc.text(fromName || "Your Business", 20, 52);
    doc.setFontSize(9);
    doc.setTextColor(100);
    fromAddress.split("\n").forEach((line, i) => doc.text(line, 20, 58 + i * 5));

    // To
    doc.setFontSize(8);
    doc.setTextColor(150);
    doc.text("BILL TO", 110, 45);
    doc.setFontSize(11);
    doc.setTextColor(50);
    doc.text(toName || "Client Name", 110, 52);
    doc.setFontSize(9);
    doc.setTextColor(100);
    toAddress.split("\n").forEach((line, i) => doc.text(line, 110, 58 + i * 5));

    // Table header
    let y = 90;
    doc.setFillColor(245, 245, 245);
    doc.rect(20, y - 5, 170, 10, "F");
    doc.setFontSize(8);
    doc.setTextColor(100);
    doc.text("DESCRIPTION", 22, y);
    doc.text("QTY", 120, y);
    doc.text("RATE", 140, y);
    doc.text("AMOUNT", 185, y, { align: "right" });

    // Line items
    y += 12;
    doc.setFontSize(10);
    doc.setTextColor(60);
    lineItems.forEach((item) => {
      doc.text(item.description || "-", 22, y);
      doc.text(String(item.qty), 120, y);
      doc.text(currency + item.rate.toFixed(2), 140, y);
      doc.text(currency + (item.qty * item.rate).toFixed(2), 185, y, { align: "right" });
      y += 8;
    });

    // Totals
    y += 10;
    doc.setDrawColor(220);
    doc.line(130, y - 5, 190, y - 5);

    doc.setFontSize(9);
    doc.setTextColor(100);
    doc.text("Subtotal", 140, y);
    doc.text(currency + totals.subtotal.toFixed(2), 185, y, { align: "right" });

    if (discount > 0) {
      y += 7;
      doc.text("Discount", 140, y);
      doc.text("-" + currency + discount.toFixed(2), 185, y, { align: "right" });
    }

    if (taxRate > 0) {
      y += 7;
      doc.text(`Tax (${taxRate}%)`, 140, y);
      doc.text(currency + totals.tax.toFixed(2), 185, y, { align: "right" });
    }

    y += 10;
    doc.setDrawColor(200);
    doc.line(130, y - 3, 190, y - 3);
    doc.setFontSize(12);
    doc.setTextColor(40);
    doc.text("Total", 140, y + 3);
    doc.text(currency + totals.total.toFixed(2), 185, y + 3, { align: "right" });

    // Notes
    if (notes) {
      y += 25;
      doc.setFontSize(8);
      doc.setTextColor(150);
      doc.text("NOTES", 20, y);
      doc.setFontSize(9);
      doc.setTextColor(100);
      doc.text(notes, 20, y + 6);
    }

    doc.save(`invoice-${invoiceNumber}.pdf`);
  };

  return (
    <div className="min-h-screen bg-[#fafafa] text-gray-900">
      {/* Header */}
      <header className="border-b border-gray-200 bg-white">
        <div className="mx-auto max-w-7xl px-6 py-4 flex items-center gap-4">
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-sm text-gray-500 hover:text-gray-900 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            Back
          </Link>
          <div className="h-4 w-px bg-gray-200" />
          <h1 className="text-lg font-semibold">
            Invoice<span className="text-emerald-600">Craft</span>
          </h1>
        </div>
      </header>

      <div className="mx-auto max-w-7xl px-6 py-8">
        <div className="grid lg:grid-cols-2 gap-8">
          {/* Form */}
          <div className="space-y-6">
            <div className="rounded-xl border border-gray-200 bg-white p-6 space-y-6">
              <h2 className="text-xs uppercase tracking-wider text-gray-500 font-medium">
                Your Business
              </h2>
              <div className="space-y-4">
                <div>
                  <Label htmlFor="fromName">Business Name</Label>
                  <Input
                    id="fromName"
                    value={fromName}
                    onChange={(e) => setFromName(e.target.value)}
                    placeholder="Your Company Name"
                  />
                </div>
                <div>
                  <Label htmlFor="fromAddress">Address & Contact</Label>
                  <Textarea
                    id="fromAddress"
                    value={fromAddress}
                    onChange={(e) => setFromAddress(e.target.value)}
                    placeholder={"123 Street Name\nCity, State ZIP\nemail@example.com"}
                    rows={3}
                  />
                </div>
              </div>
            </div>

            <div className="rounded-xl border border-gray-200 bg-white p-6 space-y-6">
              <h2 className="text-xs uppercase tracking-wider text-gray-500 font-medium">
                Bill To
              </h2>
              <div className="space-y-4">
                <div>
                  <Label htmlFor="toName">Client Name</Label>
                  <Input
                    id="toName"
                    value={toName}
                    onChange={(e) => setToName(e.target.value)}
                    placeholder="Client Company Name"
                  />
                </div>
                <div>
                  <Label htmlFor="toAddress">Client Address</Label>
                  <Textarea
                    id="toAddress"
                    value={toAddress}
                    onChange={(e) => setToAddress(e.target.value)}
                    placeholder={"456 Client Street\nCity, State ZIP"}
                    rows={2}
                  />
                </div>
              </div>
            </div>

            <div className="rounded-xl border border-gray-200 bg-white p-6 space-y-6">
              <h2 className="text-xs uppercase tracking-wider text-gray-500 font-medium">
                Invoice Details
              </h2>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="invoiceNumber">Invoice Number</Label>
                  <Input
                    id="invoiceNumber"
                    value={invoiceNumber}
                    onChange={(e) => setInvoiceNumber(e.target.value)}
                  />
                </div>
                <div>
                  <Label htmlFor="currency">Currency</Label>
                  <Select value={currency} onValueChange={setCurrency}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="$">USD ($)</SelectItem>
                      <SelectItem value="€">EUR (€)</SelectItem>
                      <SelectItem value="£">GBP (£)</SelectItem>
                      <SelectItem value="¥">JPY (¥)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="invoiceDate">Date</Label>
                  <Input
                    id="invoiceDate"
                    type="date"
                    value={invoiceDate}
                    onChange={(e) => setInvoiceDate(e.target.value)}
                  />
                </div>
                <div>
                  <Label htmlFor="dueDate">Due Date</Label>
                  <Input
                    id="dueDate"
                    type="date"
                    value={dueDate}
                    onChange={(e) => setDueDate(e.target.value)}
                  />
                </div>
              </div>
            </div>

            <div className="rounded-xl border border-gray-200 bg-white p-6 space-y-6">
              <h2 className="text-xs uppercase tracking-wider text-gray-500 font-medium">
                Line Items
              </h2>
              <div className="space-y-3">
                <div className="grid grid-cols-[2fr_1fr_1fr_1fr_40px] gap-2 text-xs text-gray-500 uppercase">
                  <span>Description</span>
                  <span>Qty</span>
                  <span>Rate</span>
                  <span>Amount</span>
                  <span />
                </div>
                {lineItems.map((item) => (
                  <div
                    key={item.id}
                    className="grid grid-cols-[2fr_1fr_1fr_1fr_40px] gap-2 items-center"
                  >
                    <Input
                      value={item.description}
                      onChange={(e) =>
                        updateLineItem(item.id, "description", e.target.value)
                      }
                      placeholder="Description"
                    />
                    <Input
                      type="number"
                      min={1}
                      value={item.qty}
                      onChange={(e) =>
                        updateLineItem(item.id, "qty", parseInt(e.target.value) || 1)
                      }
                    />
                    <Input
                      type="number"
                      min={0}
                      step={0.01}
                      value={item.rate}
                      onChange={(e) =>
                        updateLineItem(item.id, "rate", parseFloat(e.target.value) || 0)
                      }
                    />
                    <div className="text-sm text-gray-600 bg-gray-50 px-3 py-2 rounded-md">
                      {currency}{(item.qty * item.rate).toFixed(2)}
                    </div>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => removeLineItem(item.id)}
                      disabled={lineItems.length === 1}
                      className="text-gray-400 hover:text-red-500"
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                ))}
                <Button
                  variant="outline"
                  onClick={addLineItem}
                  className="w-full gap-2"
                >
                  <Plus className="w-4 h-4" />
                  Add Item
                </Button>
              </div>
            </div>

            <div className="rounded-xl border border-gray-200 bg-white p-6 space-y-6">
              <h2 className="text-xs uppercase tracking-wider text-gray-500 font-medium">
                Additional
              </h2>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="taxRate">Tax Rate (%)</Label>
                  <Input
                    id="taxRate"
                    type="number"
                    min={0}
                    max={100}
                    value={taxRate}
                    onChange={(e) => setTaxRate(parseFloat(e.target.value) || 0)}
                  />
                </div>
                <div>
                  <Label htmlFor="discount">Discount ({currency})</Label>
                  <Input
                    id="discount"
                    type="number"
                    min={0}
                    value={discount}
                    onChange={(e) => setDiscount(parseFloat(e.target.value) || 0)}
                  />
                </div>
              </div>
              <div>
                <Label htmlFor="notes">Notes</Label>
                <Textarea
                  id="notes"
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder="Payment terms, thank you message…"
                  rows={2}
                />
              </div>
            </div>

            <Button onClick={downloadPDF} className="w-full gap-2" size="lg">
              <Download className="w-4 h-4" />
              Download PDF
            </Button>
          </div>

          {/* Preview */}
          <div className="rounded-xl border border-gray-200 bg-white p-8 h-fit sticky top-8">
            <div className="flex justify-between mb-10">
              <h2 className="text-3xl font-bold text-emerald-600">INVOICE</h2>
              <div className="text-right text-sm text-gray-500">
                <div className="font-semibold text-gray-900">{invoiceNumber}</div>
                <div>Date: {formatDate(invoiceDate)}</div>
                <div>Due: {formatDate(dueDate)}</div>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-8 mb-10">
              <div>
                <div className="text-xs uppercase tracking-wider text-gray-400 mb-2">
                  From
                </div>
                <div className="font-medium">{fromName || "Your Business"}</div>
                <div className="text-sm text-gray-500 whitespace-pre-line">
                  {fromAddress}
                </div>
              </div>
              <div>
                <div className="text-xs uppercase tracking-wider text-gray-400 mb-2">
                  Bill To
                </div>
                <div className="font-medium">{toName || "Client Name"}</div>
                <div className="text-sm text-gray-500 whitespace-pre-line">
                  {toAddress}
                </div>
              </div>
            </div>

            <table className="w-full mb-8">
              <thead>
                <tr className="border-b-2 border-gray-100">
                  <th className="text-left text-xs uppercase tracking-wider text-gray-400 pb-3">
                    Description
                  </th>
                  <th className="text-xs uppercase tracking-wider text-gray-400 pb-3">
                    Qty
                  </th>
                  <th className="text-xs uppercase tracking-wider text-gray-400 pb-3">
                    Rate
                  </th>
                  <th className="text-right text-xs uppercase tracking-wider text-gray-400 pb-3">
                    Amount
                  </th>
                </tr>
              </thead>
              <tbody>
                {lineItems.map((item) => (
                  <tr key={item.id} className="border-b border-gray-50">
                    <td className="py-3 text-sm">{item.description || "-"}</td>
                    <td className="py-3 text-sm text-center">{item.qty}</td>
                    <td className="py-3 text-sm text-center">
                      {currency}{item.rate.toFixed(2)}
                    </td>
                    <td className="py-3 text-sm text-right">
                      {currency}{(item.qty * item.rate).toFixed(2)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>

            <div className="ml-auto w-48 space-y-2 text-sm">
              <div className="flex justify-between text-gray-500">
                <span>Subtotal</span>
                <span>{currency}{totals.subtotal.toFixed(2)}</span>
              </div>
              {discount > 0 && (
                <div className="flex justify-between text-gray-500">
                  <span>Discount</span>
                  <span>-{currency}{discount.toFixed(2)}</span>
                </div>
              )}
              {taxRate > 0 && (
                <div className="flex justify-between text-gray-500">
                  <span>Tax ({taxRate}%)</span>
                  <span>{currency}{totals.tax.toFixed(2)}</span>
                </div>
              )}
              <div className="flex justify-between font-semibold text-lg pt-2 border-t-2 border-gray-100">
                <span>Total</span>
                <span>{currency}{totals.total.toFixed(2)}</span>
              </div>
            </div>

            {notes && (
              <div className="mt-10 pt-6 border-t border-gray-100">
                <div className="text-xs uppercase tracking-wider text-gray-400 mb-2">
                  Notes
                </div>
                <p className="text-sm text-gray-500">{notes}</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
