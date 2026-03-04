export const DUMMY_INSIGHTS = [
  {
    id: 1,
    title: 'Tantangan Ekonomi di Wilayah Perbatasan Kalimantan',
    description: 'Tinjauan mendalam mengenai dinamika ekonomi di wilayah perbatasan Kalimantan Utara. Analisis ini menyoroti ketergantungan pada perdagangan lintas batas dan potensi pengembangan infrastruktur logistik untuk memperkuat ketahanan ekonomi lokal serta integrasi pasar regional.',
    image: 'https://images.unsplash.com/photo-1618044733300-9472054094ee?q=80&w=2671&auto=format&fit=crop',
    region: 'kalimantan',
    region_name: 'Kalimantan Utara',
    topic: 'Ekonomi',
    created_at: '2024-02-15T00:00:00.000Z',
    updated_at: '2024-02-20T00:00:00.000Z',
    author: 'Tim BPS Kaltara',
    slug: 'tantangan-ekonomi-kalimantan',
    views: 1250,
    link: 'https://public.tableau.com/views/WorldIndicators/GDPpercapita?:embed=y&:display_count=yes&:showVizHome=no',
    table_data: [
      { kabupaten: 'Bulungan', pdrb: 45.2, pertumbuhan: 5.4, kemiskinan: 6.1 },
      { kabupaten: 'Malinau', pdrb: 38.1, pertumbuhan: 4.8, kemiskinan: 7.2 },
      { kabupaten: 'Nunukan', pdrb: 42.5, pertumbuhan: 5.1, kemiskinan: 6.8 },
      { kabupaten: 'Tana Tidung', pdrb: 35.8, pertumbuhan: 4.5, kemiskinan: 5.9 },
      { kabupaten: 'Kota Tarakan', pdrb: 52.4, pertumbuhan: 6.2, kemiskinan: 4.5 }
    ],
    chart_data: {
      labels: ['Bulungan', 'Malinau', 'Nunukan', 'Tana Tidung', 'Tarakan'],
      datasets: [
        {
          label: 'Laju Pertumbuhan Ekonomi (%)',
          data: [5.4, 4.8, 5.1, 4.5, 6.2],
          backgroundColor: 'rgba(217, 119, 6, 0.1)',
          borderColor: 'rgba(217, 119, 6, 1)',
          borderWidth: 2,
          fill: true,
          tension: 0.4
        },
        {
          label: 'Tingkat Kemiskinan (%)',
          data: [6.1, 7.2, 6.8, 5.9, 4.5],
          backgroundColor: 'rgba(20, 184, 166, 0.1)',
          borderColor: 'rgba(20, 184, 166, 1)',
          borderWidth: 2,
          fill: true,
          tension: 0.4
        }
      ]
    }
  },
  {
    id: 2,
    title: 'Potensi Wisata Bahari Sulawesi Selatan',
    description: 'Sulawesi Selatan memiliki garis pantai yang panjang dengan kekayaan hayati laut yang luar biasa. Analisis ini memetakan titik-titik potensial wisata bahari dan dampaknya terhadap kontribusi sektor pariwisata dalam PDRB regional, serta tantangan pelestarian ekosistem.',
    image: 'https://images.unsplash.com/photo-1516690561799-46d8f74f9abf?q=80&w=2670&auto=format&fit=crop',
    region: 'sulawesi',
    region_name: 'Sulawesi Selatan',
    topic: 'Pariwisata',
    created_at: '2024-02-10T00:00:00.000Z',
    author: 'Analisis Regional',
    slug: 'wisata-bahari-sulawesi',
    views: 890,
    link: 'https://public.tableau.com/views/RegionalTourismAnalysis/Dashboard?:embed=y&:display_count=yes&:showVizHome=no',
    table_data: [
      { daerah: 'Makassar', kunjungan: 125000, okupansi: 72, devisa: 450 },
      { daerah: 'Bulukumba', kunjungan: 85000, okupansi: 65, devisa: 320 },
      { daerah: 'Selayar', kunjungan: 45000, okupansi: 58, devisa: 180 },
      { daerah: 'Maros', kunjungan: 95000, okupansi: 68, devisa: 290 }
    ],
    chart_data: {
      labels: ['Makassar', 'Bulukumba', 'Selayar', 'Maros'],
      datasets: [
        {
          label: 'Jumlah Kunjungan Wisatawan',
          data: [125000, 85000, 45000, 95000],
          backgroundColor: 'rgba(56, 189, 248, 0.2)',
          borderColor: 'rgba(56, 189, 248, 1)',
          borderWidth: 2,
          fill: true,
          tension: 0.4
        }
      ]
    }
  },
  {
    id: 3,
    title: 'Distribusi Pangan di Kepulauan Maluku',
    description: 'Analisis logistik dan rantai pasok pangan di wilayah Kepulauan Maluku. Fokus pada kestabilan harga kebutuhan pokok antar pulau dan peran konektivitas pelabuhan dalam menekan angka inflasi daerah akibat biaya distribusi.',
    image: 'https://images.unsplash.com/photo-1495539406979-bf61750d38ad?q=80&w=2670&auto=format&fit=crop',
    region: 'maluku',
    region_name: 'Maluku',
    topic: 'Pertanian',
    created_at: '2024-02-05T00:00:00.000Z',
    author: 'Data Insight Pangan',
    slug: 'pangan-maluku',
    views: 670,
    table_data: [
      { komoditas: 'Beras', stok: 1200, harga: 14500, status: 'Aman' },
      { komoditas: 'Cabai Red', stok: 450, harga: 45000, status: 'Waspada' },
      { komoditas: 'Bawang Merah', stok: 600, harga: 38000, status: 'Aman' },
      { komoditas: 'Daging Sapi', stok: 300, harga: 125000, status: 'Stabil' }
    ],
    chart_data: {
      labels: ['Beras', 'Cabai Red', 'Bawang Merah', 'Daging Sapi'],
      datasets: [
        {
          label: 'Indeks Harga (per Kg)',
          data: [14500, 45000, 38000, 125000],
          backgroundColor: 'rgba(244, 63, 94, 0.2)',
          borderColor: 'rgba(244, 63, 94, 1)',
          borderWidth: 2,
          fill: true,
          tension: 0.4
        }
      ]
    }
  },
  {
    id: 4,
    title: 'Perkembangan Infrastruktur Digital Papua',
    description: 'Evaluasi penetrasi jaringan internet dan infrastruktur digital di tanah Papua. Bagaimana konektivitas digital mendorong efisiensi layanan publik dan membuka peluang ekonomi baru bagi pemuda Papua di sektor kreatif.',
    image: 'https://images.unsplash.com/photo-1518770660439-4636190af475?q=80&w=2670&auto=format&fit=crop',
    region: 'papua',
    region_name: 'Papua Barat',
    topic: 'Infrastruktur',
    created_at: '2024-01-28T00:00:00.000Z',
    author: 'Kementerian Komunikasi',
    slug: 'digital-papua',
    views: 1100,
    table_data: [
      { wilayah: 'Manokwari', jangkauan: 85, kec_rata: 24, pengguna: 120000 },
      { wilayah: 'Sorong', jangkauan: 88, kec_rata: 28, pengguna: 156000 },
      { wilayah: 'Fakfak', jangkauan: 65, kec_rata: 12, pengguna: 45000 },
      { wilayah: 'Kaimana', jangkauan: 62, kec_rata: 10, pengguna: 38000 }
    ],
    chart_data: {
      labels: ['Manokwari', 'Sorong', 'Fakfak', 'Kaimana'],
      datasets: [
        {
          label: 'Persentase Jangkauan 4G (%)',
          data: [85, 88, 65, 62],
          backgroundColor: 'rgba(99, 102, 241, 0.2)',
          borderColor: 'rgba(99, 102, 241, 1)',
          borderWidth: 2,
          fill: true,
          tension: 0.4
        }
      ]
    }
  },
  {
    id: 5,
    title: 'Analisis Sektor Logistik di Sulawesi Tengah',
    description: 'Menelusuri efisiensi rantai pasok di Sulawesi Tengah. Bagaimana integrasi pelabuhan dan jalur darat mempengaruhi kecepatan distribusi barang modal untuk industri pertambangan dan perkebunan.',
    image: 'https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?q=80&w=2670&auto=format&fit=crop',
    region: 'sulawesi',
    region_name: 'Sulawesi Tengah',
    topic: 'Logistik',
    created_at: '2024-01-15T00:00:00.000Z',
    author: 'Transport & Logis',
    slug: 'logistik-sulteng',
    views: 450,
    table_data: [
      { rute: 'Palu - Makassar', volume: 4500, waktu: 48, biaya: 12.5 },
      { rute: 'Palu - Balikpapan', volume: 2800, waktu: 72, biaya: 15.8 },
      { rute: 'Palu - Jakarta', volume: 1500, waktu: 120, biaya: 22.4 }
    ],
    chart_data: {
      labels: ['Palu-Mks', 'Palu-Bpn', 'Palu-Jkt'],
      datasets: [
        {
          label: 'Volume Logistik (Ton)',
          data: [4500, 2800, 1500],
          backgroundColor: 'rgba(234, 179, 8, 0.2)',
          borderColor: 'rgba(234, 179, 8, 1)',
          borderWidth: 2,
          fill: true,
          tension: 0.4
        }
      ]
    }
  },
  {
    id: 6,
    title: 'Potensi Serapan Tenaga Kerja Industri Maluku Utara',
    description: 'Analisis mengenai korelasi pertumbuhan industri pengolahan nikel dengan penyerapan tenaga kerja lokal di Maluku Utara. Fokus pada mapping skill yang dibutuhkan untuk mendukung hilirisasi industri.',
    image: 'https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?q=80&w=2670&auto=format&fit=crop',
    region: 'maluku',
    region_name: 'Maluku Utara',
    topic: 'Ketenagakerjaan',
    created_at: '2024-01-05T00:00:00.000Z',
    author: 'Disnaker Prov',
    slug: 'naker-malut',
    views: 520,
    table_data: [
      { industri: 'Smelter Nikel', lokal: 4500, migran: 1200, total: 5700 },
      { industri: 'Pengemasan Ikan', lokal: 1200, migran: 100, total: 1300 },
      { industri: 'Konstruksi', lokal: 2200, migran: 800, total: 3000 }
    ],
    chart_data: {
      labels: ['Smelter', 'Ikan', 'Konstruksi'],
      datasets: [
        {
          label: 'Tenaga Kerja Lokal',
          data: [4500, 1200, 2200],
          backgroundColor: 'rgba(16, 185, 129, 0.2)',
          borderColor: 'rgba(16, 185, 129, 1)',
          borderWidth: 2,
          fill: true,
          tension: 0.4
        },
        {
          label: 'Tenaga Kerja Migran',
          data: [1200, 100, 800],
          backgroundColor: 'rgba(71, 85, 105, 0.2)',
          borderColor: 'rgba(71, 85, 105, 1)',
          borderWidth: 2,
          fill: true,
          tension: 0.4
        }
      ]
    }
  }
]
