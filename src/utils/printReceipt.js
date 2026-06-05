const printReceipt = (data) => {
  console.log("PRINT:", data);

  const win = window.open("", "PRINT", "width=400,height=600");

  win.document.write(`
    <html>
      <head>
        <title>Chek</title>
        <style>
          body { font-family: sans-serif; padding: 10px; }
        </style>
      </head>
      <body>
        <h3>Chek</h3>
        <p>Jami: ${data.total}</p>
        <p>Eski qarz: ${data.oldDebt}</p>
        <p>Umumiy qarz: ${data.totalDebt}</p>
      </body>
    </html>
  `);

  win.document.close();
  win.print();
};

export default printReceipt;