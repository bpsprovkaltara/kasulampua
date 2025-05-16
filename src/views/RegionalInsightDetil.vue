<template>
  <Navbar />

  <div class="header_insight">
    <PageHeader :title_detil="title_detail" />


    <div class="py-5">
      <div class="container">

        <h3 class="fw-semibold text-center mb-3">
          {{ title }}
        </h3>

        <p class="text-center text-muted mx-auto mb-4" style="max-width: 800px;">
          {{ description }}
        </p>

        <div class="d-flex flex-wrap justify-content-between align-items-center small mb-4 px-4 py-2 rounded shadow-sm"
          style="background-color: rgba(255, 255, 255, 0.7);">

          <div class="d-flex flex-wrap gap-3">
            <div>
              <i class="bi bi-calendar-event me-1"></i> {{ date }}
            </div>
            <div>
              <i class="bi bi-person me-1"></i> {{ author }}
            </div>
            <div>
              <i class="bi bi-eye me-1"></i> {{ views }}
            </div>
          </div>
          <div>
            <span>Last Modified: {{ lastModified }}</span>
          </div>
        </div>

        <div class="bg-white rounded shadow-sm p-3" style="max-width: 100%; overflow: hidden;">
          <iframe frameborder="0" allowtransparency="true" allowfullscreen="true" title="Data Visualization" marginheight="0" marginwidth="0" scrolling="no"
           style="display: block; width: 100%;; height: 2927px; visibility: visible;"
           :src="url_visualisasi"></iframe>
        </div>
      </div>
    </div>
  </div>
  <Kontak />
  <Footer />
</template>

<script setup>
import Navbar from '../components/Nav.vue'
import Footer from '../components/Footer.vue'
import Kontak from '../components/KontakSection.vue'
import PageHeader from '../components/Breadc.vue'

const title_detail = {
    title: 'Kemiskinan Regional Kalimantan dari Sisi Ketenaga Kerjaaan',
    parent: [
      { label: 'Regional Insight', path: '/regional_insight' },
    ]
  }

  const title = 'Kemiskinan Regional Kalimantan dari Sisi Ketenaga Kerjaaan'
const description =
  'Visualisasi ini menyajikan hubungan antara tingkat kemiskinan dan indikator ketenagakerjaan di lima provinsi wilayah Kalimantan: Kalimantan Barat, Kalimantan Tengah, Kalimantan Selatan, Kalimantan Timur, dan Kalimantan Utara. Data ditampilkan dalam bentuk grafik kombinasi (bar & line), peta tematik, dan diagram donat.'
const date = '11 Juni 2025'
const author = 'John Doe'
const views = '1.011'
const lastModified = '11/06/2025 12:00'
const url_visualisasi = 'https://public.tableau.com/views/ANGKAKEKERASANANAKJAWABARATMENINGKATNASIBGENERASIEMASTERANCAM/Dashboard1?:language=en-US&:sid=&:redirect=auth&:display_count=n&:origin=viz_share_link&:size=1068,1&:embed=y&:showVizHome=n&:bootstrapWhenNotified=y&:tabs=n&:toolbar=n&:apiID=host0#navType=0&navSrc=Parse'
</script>
