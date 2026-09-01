import React, { useState } from 'react';
import { Plus, Trash2, Printer, Download, Copy, Check, FileText, Building2, User, Sparkles } from 'lucide-react';
import { trackToolUsage, trackEvent } from '../lib/analytics';

interface InvoiceItem {
  id: string;
  description: string;
  quantity: number;
  unitPrice: number;
}

export const InvoiceGenerator: React.FC = () => {
  // Company / Sender Details
  const [senderName, setSenderName] = useState('شركة الحلول الرقمية / المستقل');
  const [senderEmail, setSenderEmail] = useState('info@example.com');
  const [senderPhone, setSenderPhone] = useState('+966 50 000 0000');
  const [senderAddress, setSenderAddress] = useState('الرياض، المملكة العربية السعودية');
  const [taxNumber, setTaxNumber] = useState('300000000000003');

  // Client Details
  const [clientName, setClientName] = useState('مؤسسة الأفق للتجارة والتقنية');
  const [clientEmail, setClientEmail] = useState('finance@client-domain.com');
  const [clientAddress, setClientAddress] = useState('جدة، المملكة العربية السعودية');

  // Invoice Meta
  const [invoiceNumber, setInvoiceNumber] = useState('INV-2025-001');
  const [issueDate, setIssueDate] = useState(new Date().toISOString().split('T')[0]);
  const [dueDate, setDueDate] = useState(
    new Date(Date.now() + 14 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]
  );
  const [currency, setCurrency] = useState('SAR');

  // Items
  const [items, setItems] = useState<InvoiceItem[]>([
    { id: '1', description: 'تصميم وبرمجة واجهات المستخدم للمنصة (UI/UX)', quantity: 1, unitPrice: 2500 },
    { id: '2', description: 'تطوير وبرمجة الواجهة الخلفية وربط واجهات API', quantity: 1, unitPrice: 3500 },
    { id: '3', description: 'صيانة ودعم فني واستضافة سحابية لمدة 3 أشهر', quantity: 3, unitPrice: 400 },
  ]);

  // Tax & Discount
  const [taxRate, setTaxRate] = useState<number>(15); // 15% VAT
  const [discountAmount, setDiscountAmount] = useState<number>(0);
  const [notes, setNotes] = useState('شكراً لتعاملكم معنا! يُرجى تحويل المستحقات إلى الحساب البنكي المعتمد.');

  const [copied, setCopied] = useState(false);

  // Calculations
  const subtotal = items.reduce((acc, item) => acc + (item.quantity * item.unitPrice), 0);
  const discount = Math.max(0, discountAmount);
  const taxableAmount = Math.max(0, subtotal - discount);
  const tax = taxableAmount * (taxRate / 100);
  const grandTotal = taxableAmount + tax;

  const addItem = () => {
    const newItem: InvoiceItem = {
      id: Date.now().toString(),
      description: '',
      quantity: 1,
      unitPrice: 0,
    };
    setItems([...items, newItem]);
    trackEvent('invoice_item_added');
  };

  const removeItem = (id: string) => {
    if (items.length > 1) {
      setItems(items.filter((item) => item.id !== id));
      trackEvent('invoice_item_removed');
    }
  };

  const updateItem = (id: string, field: keyof InvoiceItem, val: string | number) => {
    setItems(
      items.map((item) => {
        if (item.id === id) {
          return { ...item, [field]: val };
        }
        return item;
      })
    );
  };

  const handlePrint = () => {
    trackToolUsage('invoice-generator', 'مولد الفواتير الاحترافية', 'print_invoice');
    window.print();
  };

  const handleCopySummary = () => {
    const text = `فاتورة رقم: ${invoiceNumber}\nمن: ${senderName}\nإلى: ${clientName}\nتاريخ الاستحقاق: ${dueDate}\nالمجموع الفرعي: ${subtotal.toLocaleString()} ${currency}\nالضريبة (${taxRate}%): ${tax.toLocaleString()} ${currency}\nالإجمالي النهائي: ${grandTotal.toLocaleString()} ${currency}`;
    navigator.clipboard.writeText(text);
    setCopied(true);
    trackToolUsage('invoice-generator', 'مولد الفواتير الاحترافية', 'copy_summary');
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="space-y-8">
      {/* Top Action Bar */}
      <div className="flex flex-wrap items-center justify-between gap-4 bg-white dark:bg-gray-900 rounded-2xl border border-gray-200/80 dark:border-gray-800 p-4 sm:p-5 shadow-xs transition-colors print:hidden">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-blue-50 dark:bg-blue-950/60 text-blue-600 dark:text-blue-400 flex items-center justify-center">
            <FileText className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-base font-extrabold text-gray-900 dark:text-white">
              صانع الفواتير للعمل الحر والشركات
            </h2>
            <span className="text-xs text-gray-500 dark:text-gray-400">
              عدّل البيانات بالأسفل لمعاينة وطباعة أو حفظ الفاتورة كملف PDF
            </span>
          </div>
        </div>

        <div className="flex items-center gap-2.5">
          <button
            type="button"
            onClick={handleCopySummary}
            className="px-3.5 py-2 bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-xl text-xs font-bold transition-colors flex items-center gap-1.5 cursor-pointer"
          >
            {copied ? <Check className="w-4 h-4 text-emerald-600" /> : <Copy className="w-4 h-4" />}
            <span>{copied ? 'تم النسخ!' : 'نسخ الملخص'}</span>
          </button>

          <button
            type="button"
            onClick={handlePrint}
            className="px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded-xl text-xs font-bold transition-all shadow-xs flex items-center gap-2 cursor-pointer"
          >
            <Printer className="w-4 h-4" />
            <span>طباعة / حفظ PDF</span>
          </button>
        </div>
      </div>

      {/* Invoice Sheet (Visual Live Template) */}
      <div id="invoice-printable-area" className="bg-white dark:bg-gray-900 rounded-3xl border border-gray-200/80 dark:border-gray-800 p-6 sm:p-10 shadow-sm space-y-8 transition-colors print:border-none print:shadow-none print:p-0">
        
        {/* Header: Brand & Invoice Meta */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 border-b border-gray-100 dark:border-gray-800 pb-8">
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <Building2 className="w-5 h-5 text-blue-600 dark:text-blue-400 print:hidden" />
              <input
                type="text"
                value={senderName}
                onChange={(e) => setSenderName(e.target.value)}
                placeholder="اسم شركتك أو اسمك المهني"
                className="text-xl sm:text-2xl font-black text-gray-900 dark:text-white bg-transparent border-b border-transparent hover:border-gray-300 dark:hover:border-gray-700 focus:border-blue-500 focus:outline-none w-full"
              />
            </div>
            <div className="space-y-1 text-xs text-gray-500 dark:text-gray-400">
              <input
                type="text"
                value={senderAddress}
                onChange={(e) => setSenderAddress(e.target.value)}
                placeholder="العنوان والمدينة"
                className="w-full bg-transparent border-b border-transparent hover:border-gray-300 dark:hover:border-gray-700 focus:border-blue-500 focus:outline-none"
              />
              <div className="flex gap-2">
                <input
                  type="text"
                  value={senderEmail}
                  onChange={(e) => setSenderEmail(e.target.value)}
                  placeholder="البريد الإلكتروني"
                  className="w-1/2 bg-transparent border-b border-transparent hover:border-gray-300 dark:hover:border-gray-700 focus:border-blue-500 focus:outline-none"
                />
                <input
                  type="text"
                  value={senderPhone}
                  onChange={(e) => setSenderPhone(e.target.value)}
                  placeholder="رقم الهاتف"
                  className="w-1/2 bg-transparent border-b border-transparent hover:border-gray-300 dark:hover:border-gray-700 focus:border-blue-500 focus:outline-none"
                />
              </div>
              <div className="pt-1">
                <span className="text-[11px] font-bold text-gray-400">الرقم الضريبي: </span>
                <input
                  type="text"
                  value={taxNumber}
                  onChange={(e) => setTaxNumber(e.target.value)}
                  placeholder="300000000000003"
                  className="bg-transparent border-b border-transparent hover:border-gray-300 dark:hover:border-gray-700 focus:border-blue-500 focus:outline-none font-mono"
                />
              </div>
            </div>
          </div>

          <div className="flex flex-col items-start md:items-end justify-start space-y-2 text-left md:text-right">
            <span className="text-3xl sm:text-4xl font-black text-blue-600 dark:text-blue-400 uppercase tracking-tight">
              فاتورة ضريبية
            </span>
            <div className="space-y-1 text-xs text-gray-600 dark:text-gray-300">
              <div className="flex items-center gap-2">
                <span className="font-bold text-gray-400">رقم الفاتورة:</span>
                <input
                  type="text"
                  value={invoiceNumber}
                  onChange={(e) => setInvoiceNumber(e.target.value)}
                  className="font-extrabold text-gray-900 dark:text-white bg-transparent border-b border-transparent hover:border-gray-300 dark:hover:border-gray-700 focus:border-blue-500 focus:outline-none text-left"
                />
              </div>
              <div className="flex items-center gap-2">
                <span className="font-bold text-gray-400">تاريخ الإصدار:</span>
                <input
                  type="date"
                  value={issueDate}
                  onChange={(e) => setIssueDate(e.target.value)}
                  className="bg-transparent border-b border-transparent hover:border-gray-300 dark:hover:border-gray-700 focus:border-blue-500 focus:outline-none"
                />
              </div>
              <div className="flex items-center gap-2">
                <span className="font-bold text-gray-400">تاريخ الاستحقاق:</span>
                <input
                  type="date"
                  value={dueDate}
                  onChange={(e) => setDueDate(e.target.value)}
                  className="bg-transparent border-b border-transparent hover:border-gray-300 dark:hover:border-gray-700 focus:border-blue-500 focus:outline-none font-bold text-red-600 dark:text-red-400"
                />
              </div>
              <div className="flex items-center gap-2 pt-1">
                <span className="font-bold text-gray-400">العملة:</span>
                <select
                  value={currency}
                  onChange={(e) => setCurrency(e.target.value)}
                  className="bg-transparent border border-gray-300 dark:border-gray-700 rounded px-2 py-0.5 font-bold cursor-pointer"
                >
                  <option value="SAR">ريال سعودي (SAR)</option>
                  <option value="AED">درهم إماراتي (AED)</option>
                  <option value="EGP">جنيه مصري (EGP)</option>
                  <option value="USD">دولار أمريكي (USD)</option>
                  <option value="EUR">يورو (EUR)</option>
                  <option value="KWD">دينار كويتي (KWD)</option>
                  <option value="QAR">ريال قطري (QAR)</option>
                  <option value="JOD">دينار أردني (JOD)</option>
                </select>
              </div>
            </div>
          </div>
        </div>

        {/* Bill To / Client Details */}
        <div className="bg-gray-50/80 dark:bg-gray-800/40 p-4 sm:p-5 rounded-2xl border border-gray-200/60 dark:border-gray-800 space-y-2">
          <div className="flex items-center gap-2 text-xs font-black text-gray-500 dark:text-gray-400 uppercase">
            <User className="w-4 h-4 text-blue-600 dark:text-blue-400" />
            <span>بيانات العميل (فاتورة إلى):</span>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <input
              type="text"
              value={clientName}
              onChange={(e) => setClientName(e.target.value)}
              placeholder="اسم العميل أو اسم المؤسسة"
              className="text-sm font-bold text-gray-900 dark:text-white bg-transparent border-b border-transparent hover:border-gray-300 dark:hover:border-gray-700 focus:border-blue-500 focus:outline-none"
            />
            <input
              type="text"
              value={clientEmail}
              onChange={(e) => setClientEmail(e.target.value)}
              placeholder="البريد الإلكتروني للعميل"
              className="text-xs text-gray-600 dark:text-gray-300 bg-transparent border-b border-transparent hover:border-gray-300 dark:hover:border-gray-700 focus:border-blue-500 focus:outline-none"
            />
            <input
              type="text"
              value={clientAddress}
              onChange={(e) => setClientAddress(e.target.value)}
              placeholder="عنوان العميل"
              className="text-xs text-gray-600 dark:text-gray-300 bg-transparent border-b border-transparent hover:border-gray-300 dark:hover:border-gray-700 focus:border-blue-500 focus:outline-none"
            />
          </div>
        </div>

        {/* Itemized Table */}
        <div className="space-y-3">
          <div className="overflow-x-auto">
            <table className="w-full text-right text-xs">
              <thead>
                <tr className="border-b-2 border-gray-200 dark:border-gray-800 text-gray-500 dark:text-gray-400 font-bold uppercase">
                  <th className="py-3 px-2">الوصف والخدمة</th>
                  <th className="py-3 px-2 w-20 text-center">الكمية</th>
                  <th className="py-3 px-2 w-28 text-center">السعر الفردي</th>
                  <th className="py-3 px-2 w-28 text-left">الإجمالي ({currency})</th>
                  <th className="py-3 px-2 w-10 print:hidden"></th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 dark:divide-gray-800">
                {items.map((item) => (
                  <tr key={item.id} className="group hover:bg-gray-50/50 dark:hover:bg-gray-800/30">
                    <td className="py-3 px-2">
                      <input
                        type="text"
                        value={item.description}
                        onChange={(e) => updateItem(item.id, 'description', e.target.value)}
                        placeholder="اكتب وصف الخدمة أو البند هنا..."
                        className="w-full font-semibold text-gray-800 dark:text-gray-200 bg-transparent border-b border-transparent hover:border-gray-300 dark:hover:border-gray-700 focus:border-blue-500 focus:outline-none"
                      />
                    </td>
                    <td className="py-3 px-2 text-center">
                      <input
                        type="number"
                        min="1"
                        value={item.quantity}
                        onChange={(e) => updateItem(item.id, 'quantity', parseFloat(e.target.value) || 0)}
                        className="w-16 text-center font-bold text-gray-800 dark:text-gray-200 bg-transparent border border-gray-200 dark:border-gray-700 rounded px-1 py-1"
                      />
                    </td>
                    <td className="py-3 px-2 text-center">
                      <input
                        type="number"
                        min="0"
                        value={item.unitPrice}
                        onChange={(e) => updateItem(item.id, 'unitPrice', parseFloat(e.target.value) || 0)}
                        className="w-24 text-center font-bold text-gray-800 dark:text-gray-200 bg-transparent border border-gray-200 dark:border-gray-700 rounded px-1 py-1"
                      />
                    </td>
                    <td className="py-3 px-2 text-left font-extrabold text-gray-900 dark:text-white">
                      {(item.quantity * item.unitPrice).toLocaleString()}
                    </td>
                    <td className="py-3 px-2 text-center print:hidden">
                      <button
                        type="button"
                        onClick={() => removeItem(item.id)}
                        disabled={items.length <= 1}
                        className="text-gray-400 hover:text-red-500 disabled:opacity-30 transition-colors p-1 cursor-pointer"
                        title="حذف البند"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <button
            type="button"
            onClick={addItem}
            className="px-3 py-1.5 border border-dashed border-blue-400 dark:border-blue-600 text-blue-600 dark:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-950/40 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer print:hidden"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>إضافة بند جديد للفاتورة</span>
          </button>
        </div>

        {/* Footer Totals & Notes */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-6 border-t border-gray-100 dark:border-gray-800 pt-6">
          <div className="md:col-span-7 space-y-2">
            <span className="text-xs font-bold text-gray-500 dark:text-gray-400 block">
              ملاحظات وشروط الدفع:
            </span>
            <textarea
              rows={3}
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              className="w-full text-xs text-gray-600 dark:text-gray-300 bg-gray-50 dark:bg-gray-800/60 p-3 rounded-xl border border-gray-200 dark:border-gray-700 focus:outline-none"
            />
          </div>

          <div className="md:col-span-5 space-y-2.5 text-xs text-gray-700 dark:text-gray-300">
            <div className="flex justify-between items-center">
              <span className="font-semibold text-gray-500 dark:text-gray-400">المجموع الفرعي:</span>
              <span className="font-extrabold text-sm text-gray-900 dark:text-white">
                {subtotal.toLocaleString()} {currency}
              </span>
            </div>

            <div className="flex justify-between items-center gap-2">
              <div className="flex items-center gap-1">
                <span className="font-semibold text-gray-500 dark:text-gray-400">قيمة الخصم:</span>
              </div>
              <div className="flex items-center gap-1">
                <input
                  type="number"
                  min="0"
                  value={discountAmount}
                  onChange={(e) => setDiscountAmount(parseFloat(e.target.value) || 0)}
                  className="w-20 text-center font-bold bg-transparent border border-gray-200 dark:border-gray-700 rounded px-1 py-0.5"
                />
                <span>{currency}</span>
              </div>
            </div>

            <div className="flex justify-between items-center gap-2">
              <div className="flex items-center gap-1">
                <span className="font-semibold text-gray-500 dark:text-gray-400">الضريبة المضافة (%):</span>
                <input
                  type="number"
                  min="0"
                  max="100"
                  value={taxRate}
                  onChange={(e) => setTaxRate(parseFloat(e.target.value) || 0)}
                  className="w-12 text-center font-bold bg-transparent border border-gray-200 dark:border-gray-700 rounded px-1 py-0.5"
                />
              </div>
              <span className="font-bold">
                {tax.toLocaleString(undefined, { maximumFractionDigits: 2 })} {currency}
              </span>
            </div>

            <div className="flex justify-between items-center pt-3 border-t-2 border-gray-200 dark:border-gray-800 text-base font-black text-blue-600 dark:text-blue-400">
              <span>الإجمالي النهائي المطلوب:</span>
              <span>
                {grandTotal.toLocaleString(undefined, { maximumFractionDigits: 2 })} {currency}
              </span>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};
