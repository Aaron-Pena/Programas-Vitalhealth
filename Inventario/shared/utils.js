  
 
  function formatDecimal(number) {
    if (typeof number !== 'number') {
      throw new Error('El valor proporcionado no es un número.');
    }
  
    return number.toFixed(2);
  }
  
  function formatDate(date) {
    if (!(date instanceof Date)) {
      throw new Error('El valor proporcionado no es una instancia de Date.');
    }
  
    const day = date.getUTCDate();
    const month = date.getUTCMonth() + 1; // Sumamos 1 ya que los meses son base 0.
    const year = date.getUTCFullYear();
  
    // Aseguramos que los componentes de la fecha tengan al menos dos dígitos.
    const formattedDay = String(day).padStart(2, '0');
    const formattedMonth = String(month).padStart(2, '0');
  
    return `${formattedDay}/${formattedMonth}/${year}`;
  }
  