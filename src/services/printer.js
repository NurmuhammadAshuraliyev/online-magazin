/**
 * Xprinter 58 (58mm) uchun moslangan chek chiqarish funksiyasi
 * @param {Object} data - Chek ma'lumotlari
 */
export const printReceipt = (data) => {
    const { 
      customerName = "NAQD MIJOZ", 
      items = [], 
      total = 0, 
      paymentMethod = "NAQD", 
      id = Date.now() 
    } = data;
  
    const date = new Date().toLocaleString('uz-UZ');
  
    // Yangi oyna ochish (Printer oynasi uchun)
    const receiptWindow = window.open("", "_blank", "width=300,height=600");
    
    if (!receiptWindow) {
      alert("Brauzerda 'Pop-up' oynalar bloklangan. Iltimos, ruxsat bering.");
      return;
    }
  
    receiptWindow.document.write(`
      <html>
        <head>
          <title>SIFAT BROYLER - CHEK #${id}</title>
          <style>
            /* Printer sozlamalari */
            @page { 
              margin: 0; 
            }
            body { 
              font-family: 'Arial', sans-serif; 
              width: 48mm; /* 58mm printer uchun xavfsiz kenglik */
              padding: 2mm; 
              margin: 0;
              font-size: 11px; 
              line-height: 1.3;
              color: #000;
              text-transform: uppercase; /* Chekda hamma narsa katta harfda chiroyli chiqadi */
            }
            
            /* Markazlashgan qismlar */
            .center { text-align: center; }
            .bold { font-weight: bold; }
            
            /* Header dizayni */
            .header { 
              border-bottom: 1px solid #000; 
              margin-bottom: 8px; 
              padding-bottom: 5px; 
            }
            .shop-name { font-size: 16px; font-weight: bold; }
            
            /* Jadval dizayni */
            .table { 
              width: 100%; 
              border-collapse: collapse; 
              margin: 8px 0; 
            }
            .table th { 
              text-align: left; 
              font-size: 9px; 
              border-bottom: 1px dashed #000; 
              padding-bottom: 3px;
            }
            .table td { 
              padding: 4px 0; 
              font-size: 10px;
              vertical-align: top;
            }
            
            /* Chiziqlar */
            .line { border-top: 1px dashed #000; margin: 5px 0; }
            .double-line { border-top: 1px solid #000; margin: 2px 0; }
            
            /* Jami qismi */
            .total-box { 
              margin-top: 5px; 
              padding-top: 5px; 
            }
            .total-row { 
              display: flex; 
              justify-content: space-between; 
              font-size: 13px; 
              font-weight: bold; 
            }
            
            /* Footer */
            .footer { 
              margin-top: 15px; 
              font-size: 9px; 
              text-align: center;
            }
          </style>
        </head>
        <body>
          <div class="header center">
            <div class="shop-name">SIFAT BROYLER</div>
            <div style="font-size: 8px;">Yozyovon tumani, 066-shoxobcha</div>
            <div style="font-size: 9px;">TEL: +998 90 123 45 67</div>
          </div>
  
          <div style="font-size: 9px;">
            <div style="display:flex; justify-content:space-between">
              <span>CHEK: #${id.toString().slice(-6)}</span>
              <span>${date.split(',')[0]}</span>
            </div>
            <div>VAQT: ${date.split(',')[1] || ''}</div>
            <div>MIJOZ: ${customerName.substring(0, 18)}</div>
          </div>
  
          <table class="table">
            <thead>
              <tr>
                <th width="50%">NOMI</th>
                <th width="15%">KG</th>
                <th width="35%" style="text-align:right">SUMMA</th>
              </tr>
            </thead>
            <tbody>
              ${items.map(item => `
                <tr>
                  <td>${item.name.substring(0, 12)}</td>
                  <td>${Number(item.qty).toFixed(1)}</td>
                  <td style="text-align:right">${(Number(item.price) * Number(item.qty)).toLocaleString()}</td>
                </tr>
              `).join('')}
            </tbody>
          </table>
  
          <div class="double-line"></div>
          <div class="total-box">
            <div class="total-row">
              <span>JAMI:</span>
              <span>${Number(total).toLocaleString()}</span>
            </div>
            <div style="font-size: 9px; margin-top: 3px;">
              TO'LOV TURI: ${paymentMethod}
            </div>
          </div>
          <div class="double-line"></div>
  
          <div class="footer">
            XARIDINGIZ UCHUN RAHMAT!<br>
            <div style="margin-top: 5px; font-weight: bold;">** SIFAT VA BARAKA **</div>
            <div style="font-size: 7px; margin-top: 10px; opacity: 0.7;">
              DASTUR: GEMINI POS V1.0
            </div>
          </div>
  
          <script>
            window.onload = () => {
              // Brauzer print dialogini ochadi
              window.print();
              
              // Printdan keyin oynani yopish
              // Ba'zi brauzerlarda darhol yopish chop etishga xalaqit berishi mumkin
              // shuning uchun ozroq kutish qo'shildi
              setTimeout(() => { 
                window.close(); 
              }, 500);
            };
          </script>
        </body>
      </html>
    `);
    
    receiptWindow.document.close();
  };