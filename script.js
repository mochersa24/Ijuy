function hitung() {
    const aInput = parseFloat(document.getElementById("a").value);
    const bInput = parseFloat(document.getElementById("b").value);
    const eps = parseFloat(document.getElementById("eps").value);
    const metode = document.getElementById("metode").value;
    const fungsi = document.getElementById("fungsi").value;

    const hasilElem = document.getElementById("hasil");
    hasilElem.innerHTML = "";

    let f;
    try {
        const expr = math.parse(fungsi);
        const compiled = expr.compile();
        f = x => compiled.evaluate({ x: x });

        // Uji coba fungsi
        f(aInput);
        f(bInput);
    } catch (e) {
        hasilElem.innerText = "Fungsi tidak valid: " + e.message;
        return;
    }

    if (isNaN(aInput) || isNaN(bInput) || isNaN(eps)) {
        hasilElem.innerText = "Harap isi semua input dengan benar.";
        return;
    }

    if (f(aInput) * f(bInput) >= 0) {
        hasilElem.innerText = "f(a) * f(b) harus < 0 untuk menjamin ada akar.";
        return;
    }

    let a = aInput, b = bInput, c, iter = 0;
    const data = [];

    if (metode === "bisection") {
        do {
            c = (a + b) / 2;
            const fc = f(c);
            const fa = f(a);
            const fb = f(b);
            const selangBaru = fa * fc < 0 ? "[a,c]" : "[c,b]";
            const lebar = Math.abs(b - a);
            const ket = lebar < eps;

            data.push({ iter, a, c, b, fa, fc, fb, selang: selangBaru, lebar, ket });

            if (fc === 0 || lebar < eps) break;
            fa * fc < 0 ? b = c : a = c;
            iter++;
        } while (true);
    }

    if (metode === "regula") {
        do {
            const fa = f(a);
            const fb = f(b);
            c = (a * fb - b * fa) / (fb - fa);
            const fc = f(c);
            const selangBaru = fa * fc < 0 ? "[a,c]" : "[c,b]";
            const lebar = Math.abs(fc);
            const ket = lebar < eps;

            data.push({ iter, a, c, b, fa, fc, fb, selang: selangBaru, lebar, ket });

            if (Math.abs(fc) < eps) break;
            fa * fc < 0 ? b = c : a = c;
            iter++;
        } while (true);
    }

    let table = `
    <table>
        <thead>
            <tr>
                <th>Iterasi</th>
                <th>a</th>
                <th>c</th>
                <th>b</th>
                <th>f(a)</th>
                <th>f(c)</th>
                <th>f(b)</th>
                <th>Selang Baru</th>
                <th>Lebarnya |b - a|</th>
                <th>Ket</th>
            </tr>
        </thead>
        <tbody>
    `;

    data.forEach(row => {
        table += `
        <tr>
            <td>${row.iter}</td>
            <td>${row.a.toFixed(6)}</td>
            <td>${row.c.toFixed(6)}</td>
            <td>${row.b.toFixed(6)}</td>
            <td>${row.fa.toExponential(3)}</td>
            <td>${row.fc.toExponential(3)}</td>
            <td>${row.fb.toExponential(3)}</td>
            <td>${row.selang}</td>
            <td>${row.lebar.toExponential(3)}</td>
            <td>${row.ket ? "TRUE" : "FALSE"}</td>
        </tr>`;
    });

    table += `
        </tbody>
    </table>
    <p><strong>Akar hampiran:</strong> ${data[data.length - 1].c}</p>
    <p><strong>Total Iterasi:</strong> ${data.length}</p>
    `;

    hasilElem.innerHTML = table;
}
