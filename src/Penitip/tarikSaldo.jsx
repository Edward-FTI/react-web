// import React, { useState, useEffect } from 'react';
// import { GetPenitipData, TarikSaldoPenitip } from '../api/apiPenitip';

// const TarikSaldo = () => {
//     const [saldo, setSaldo] = useState(null);
//     const [pesan, setPesan] = useState('');
//     const [penitipId, setPenitipId] = useState(null);
//     const [namaPenitip, setNamaPenitip] = useState('');
//     const [nominalTarikMin, setNominalTarikMin] = useState(null);
//     const [jumlahTarik, setJumlahTarik] = useState('');

//     useEffect(() => {
//         const fetchSaldo = async () => {
//             try {
//                 const data = await GetPenitipData();
//                 setSaldo(data.saldo);
//                 setPenitipId(data.id);
//                 setNamaPenitip(data.nama_penitip);
//                 setNominalTarikMin(data.nominalTarik);
//             } catch (error) {
//                 setPesan(error.message || 'Gagal ambil data penitip');
//             }
//         };

//         fetchSaldo();
//     }, []);

//     const handleTarik = async () => {
//         const jumlah = parseFloat(jumlahTarik);
//         const biaya = jumlah * 0.05;
//         const totalPotong = jumlah + biaya;

//         if (isNaN(jumlah) || jumlah <= 0) {
//             setPesan('Masukkan jumlah yang valid');
//             return;
//         }

//         if (jumlah < nominalTarikMin) {
//             setPesan(`Jumlah minimal penarikan adalah Rp ${nominalTarikMin.toLocaleString()}`);
//             return;
//         }

//         if (totalPotong > saldo) {
//             setPesan(`Saldo tidak cukup. Total yang akan dipotong (termasuk 5%): Rp ${totalPotong.toLocaleString()}`);
//             return;
//         }

//         try {
//             // Kirim jumlah penarikan ke backend (jika endpoint menerima jumlah)
//             const res = await TarikSaldoPenitip(penitipId, jumlah);
//             setSaldo(res.data.saldo);
//             setPesan(res.message);
//             setJumlahTarik('');
//         } catch (error) {
//             setPesan(error.message || 'Gagal tarik saldo');
//         }
//     };

//     const hitungBiaya = () => {
//         const jumlah = parseFloat(jumlahTarik);
//         return isNaN(jumlah) ? 0 : jumlah * 0.05;
//     };

//     return (
//         <div style={{
//             height: '100vh',
//             display: 'flex',
//             justifyContent: 'center',
//             alignItems: 'center',
//             backgroundColor: '#f0f2f5'
//         }}>
//             <div style={{
//                 padding: '2rem',
//                 backgroundColor: 'white',
//                 borderRadius: '10px',
//                 boxShadow: '0 4px 8px rgba(0,0,0,0.1)',
//                 textAlign: 'center',
//                 minWidth: '320px'
//             }}>
//                 <h2>Tarik Saldo</h2>

//                 {penitipId && (
//                     <div style={{ marginBottom: '15px' }}>
//                         <p><strong>ID:</strong> {penitipId}</p>
//                         <p><strong>Nama:</strong> {namaPenitip}</p>
//                         <p><strong>Saldo:</strong> Rp {saldo?.toLocaleString()}</p>
//                         <p><strong>Minimal Penarikan:</strong> Rp {nominalTarikMin?.toLocaleString()}</p>
//                     </div>
//                 )}

//                 <input
//                     type="number"
//                     value={jumlahTarik}
//                     onChange={(e) => setJumlahTarik(e.target.value)}
//                     placeholder="Jumlah penarikan"
//                     style={{
//                         padding: '8px',
//                         width: '100%',
//                         marginBottom: '10px',
//                         borderRadius: '5px',
//                         border: '1px solid #ccc'
//                     }}
//                 />
//                 {jumlahTarik && (
//                     <p style={{ fontSize: '14px' }}>
//                         Biaya admin (5%): Rp {hitungBiaya().toLocaleString()} <br />
//                         Total potong: Rp {(parseFloat(jumlahTarik) + hitungBiaya()).toLocaleString()}
//                     </p>
//                 )}
//                 <button
//                     onClick={handleTarik}
//                     style={{
//                         padding: '10px 20px',
//                         border: 'none',
//                         backgroundColor: '#4caf50',
//                         color: 'white',
//                         borderRadius: '5px',
//                         cursor: 'pointer',
//                         marginTop: '10px'
//                     }}
//                 >
//                     Tarik Saldo
//                 </button>

//                 {pesan && <p style={{ marginTop: '10px' }}>{pesan}</p>}
//             </div>
//         </div>
//     );
// };

// export default TarikSaldo;



import React, { useState, useEffect } from 'react';
import { GetPenitipData, TarikSaldoPenitip } from '../api/apiPenitip';

const TarikSaldo = () => {
    const [saldo, setSaldo] = useState(null);
    const [jumlahTarik, setJumlahTarik] = useState('');
    const [pesan, setPesan] = useState('');
    const [penitipId, setPenitipId] = useState(null);
    const [namaPenitip, setNamaPenitip] = useState('');
    const [nominal, setNominal] = useState(null);

    useEffect(() => {
        const fetchSaldo = async () => {
            try {
                const data = await GetPenitipData();
                setSaldo(data.saldo);
                setPenitipId(data.id);
                setNamaPenitip(data.nama_penitip);
            } catch (error) {
                setPesan(error.message || 'Gagal ambil data penitip');
            }
        };

        fetchSaldo();
    }, []);

    const handleTarik = async () => {
        const jumlah = parseFloat(jumlahTarik);
        if (isNaN(jumlah) || jumlah <= 0) {
            setPesan('Masukkan jumlah yang valid');
            return;
        }

        if (jumlah > saldo) {
            setPesan('Jumlah melebihi saldo');
            return;
        }

        try {
            const res = await TarikSaldoPenitip(penitipId, jumlah);
            setSaldo(res.data.saldo);
            setPesan('Saldo berhasil ditarik');
            setJumlahTarik('');
        } catch (error) {
            setPesan(error.message || 'Gagal tarik saldo');
        }
    };

    return (
        <div style={{
            height: '100vh',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            backgroundColor: '#f0f2f5'
        }}>
            <div style={{
                padding: '2rem',
                backgroundColor: 'white',
                borderRadius: '10px',
                boxShadow: '0 4px 8px rgba(0,0,0,0.1)',
                textAlign: 'center',
                minWidth: '320px'
            }}>
                <h2>Tarik Saldo</h2>

                {/* Informasi Penitip */}
                {penitipId && (
                    <div style={{ marginBottom: '15px' }}>
                        <p><strong>ID:</strong> {penitipId}</p>
                        <p><strong>Nama:</strong> {namaPenitip}</p>
                        <p><strong>Saldo:</strong> Rp {saldo?.toLocaleString()}</p>
                    </div>
                )}

                {/* Input jumlah tarik */}
                <input
                    type="number"
                    value={jumlahTarik}
                    onChange={(e) => setJumlahTarik(e.target.value)}
                    placeholder="Jumlah tarik"
                    style={{
                        padding: '8px',
                        width: '100%',
                        marginBottom: '10px',
                        borderRadius: '5px',
                        border: '1px solid #ccc'
                    }}
                />
                <button
                    onClick={handleTarik}
                    style={{
                        padding: '10px 20px',
                        border: 'none',
                        backgroundColor: '#4caf50',
                        color: 'white',
                        borderRadius: '5px',
                        cursor: 'pointer',
                        marginBottom: '10px'
                    }}
                >
                    Tarik
                </button>

                {/* Pesan */}
                {pesan && <p>{pesan}</p>}
            </div>
        </div>
    );
};

export default TarikSaldo;

