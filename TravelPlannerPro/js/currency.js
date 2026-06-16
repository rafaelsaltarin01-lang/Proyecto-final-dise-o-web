// js/currency.js

async function renderCurrencyModule(currencyCode) {
    const container = document.getElementById('currency-info');
    if (!container) return;

    container.innerHTML = `<h3 class="currency-title">💱 Conversión de Moneda (${currencyCode})</h3><p>Calculando valores...</p>`;

    const baseCurrency = currencyCode === 'USD' ? 'EUR' : 'USD';

    try {
        // 1. URL real de Frankfurter que necesitamos consultar
        const apiOriginal = `https://api.frankfurter.app/latest?from=${baseCurrency}&to=${currencyCode}`;
        
        // 2. Usamos corsproxy.io, que es un proxy directo mucho más rápido y libre de timeouts
        const urlConProxy = `https://corsproxy.io/?${encodeURIComponent(apiOriginal)}`;
        
        // 3. Hacemos la petición al nuevo proxy
        const response = await fetch(urlConProxy);
        if (!response.ok) throw new Error("Servidor proxy alternativo inalcanzable");
        
        
        const data = await response.json();
        const rate = data.rates[currencyCode];

        container.innerHTML = `
            <h3 class="currency-title">💱 Tipo de Cambio Real</h3>
            <p class="currency-subtitle">
                Tasa de mercado: <strong>1 ${baseCurrency} = ${rate.toFixed(2)} ${currencyCode}</strong>
            </p>
            <ul class="currency-list">
                <li class="currency-item">💵 <strong>50 ${baseCurrency} =</strong> ${(50 * rate).toFixed(2)} ${currencyCode}</li>
                <li class="currency-item">💵 <strong>100 ${baseCurrency} =</strong> ${(100 * rate).toFixed(2)} ${currencyCode}</li>
                <li class="currency-item">💵 <strong>200 ${baseCurrency} =</strong> ${(200 * rate).toFixed(2)} ${currencyCode}</li>
            </ul>
        `;
        console.log(`🪙 Tasas de cambio en vivo obtenidas con éxito vía corsproxy.io para: ${currencyCode}`);

    } catch (error) {
        console.warn("Falla de red en divisa. Ejecutando conversiones locales.", error);
        
       
        let mockRate = 1.0;
        if (currencyCode === 'COP') mockRate = 3456.00;
        if (currencyCode === 'JPY') mockRate = 156.50;
        if (currencyCode === 'EUR' && baseCurrency === 'USD') mockRate = 0.92;

        container.innerHTML = `
            <h3 class="currency-title">💱 Tipo de Cambio (Conversión Local)</h3>
            <p class="currency-subtitle">
                Valor de referencia: <strong>1 ${baseCurrency} = ${mockRate.toFixed(2)} ${currencyCode}</strong>
            </p>
            <ul class="currency-list">
                <li class="currency-item">💵 <strong>50 ${baseCurrency} =</strong> ${(50 * mockRate).toFixed(2)} ${currencyCode}</li>
                <li class="currency-item">💵 <strong>100 ${baseCurrency} =</strong> ${(100 * mockRate).toFixed(2)} ${currencyCode}</li>
                <li class="currency-item">💵 <strong>200 ${baseCurrency} =</strong> ${(200 * mockRate).toFixed(2)} ${currencyCode}</li>
            </ul>
        `;
    }
}