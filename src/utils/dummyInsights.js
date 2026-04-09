export const DUMMY_INSIGHTS = [
  {
    id: 1,
    title: 'Tantangan Ekonomi di Wilayah Perbatasan Kalimantan',
    description: 'Tinjauan mendalam mengenai dinamika ekonomi di wilayah perbatasan Kalimantan Utara. Analisis ini menyoroti ketergantungan pada perdagangan lintas batas dan potensi pengembangan infrastruktur logistik untuk memperkuat ketahanan ekonomi lokal serta integrasi pasar regional.',
    image: 'https://images.unsplash.com/photo-1618044733300-9472054094ee?q=80&w=2671&auto=format&fit=crop',
    region: 65,
    region_name: 'Kalimantan Utara',
    topic: 'Ekonomi',
    badge: 'Trending',
    created_at: '2024-02-15T00:00:00.000Z',
    updated_at: '2024-02-20T00:00:00.000Z',
    author: 'Tim BPS Kaltara',
    slug: 'tantangan-ekonomi-kalimantan',
    views: 1250,
    link: 'https://public.tableau.com/views/WorldIndicators/GDPpercapita?:embed=y&:display_count=yes&:showVizHome=no',
    table_data: [], 
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
        }
      ]
    }
  },
  {
    id: 2,
    title: 'Potensi Wisata Bahari Sulawesi Selatan',
    description: 'Sulawesi Selatan memiliki garis pantai yang panjang dengan kekayaan hayati laut yang luar biasa. Analisis ini memetakan titik-titik potensial wisata bahari dan dampaknya terhadap kontribusi sektor pariwisata dalam PDRB regional.',
    image: 'https://images.unsplash.com/photo-1516690561799-46d8f74f9abf?q=80&w=2670&auto=format&fit=crop',
    region: 73,
    region_name: 'Sulawesi Selatan',
    topic: 'Pariwisata',
    badge: 'Pilihan Editor',
    created_at: '2024-02-10T00:00:00.000Z',
    author: 'Analisis Regional',
    slug: 'wisata-bahari-sulawesi',
    views: 890,
    link: 'https://public.tableau.com/views/RegionalTourismAnalysis/Dashboard?:embed=y&:display_count=yes&:showVizHome=no',
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
    description: 'Analisis logistik dan rantai pasok pangan di wilayah Kepulauan Maluku. Fokus pada kestabilan harga kebutuhan pokok antar pulau dan peran konektivitas pelabuhan dalam menekan angka inflasi daerah.',
    image: 'https://images.unsplash.com/photo-1495539406979-bf61750d38ad?q=80&w=2670&auto=format&fit=crop',
    region: 81,
    region_name: 'Maluku',
    topic: 'Pertanian',
    badge: 'Analisis Terbaru',
    created_at: '2024-02-05T00:00:00.000Z',
    author: 'Regional Insight Pangan',
    slug: 'pangan-maluku',
    views: 670,
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
  }
]
