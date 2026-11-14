/* THE STARS BEYOND ETERNITY — ATLAS DATA
   Canon source: TSE-ATLAS-ELARION-001 (approved 03 Nov 2026)
   Later campaign developments may supersede historical "unvisited" claims.
   All geographical coordinates below are illustrative for this website,
   NEVER precise cartographic canon.
   All invented settlement names are explicitly CONCEPT only.
*/
window.ATLAS = {
realms:[
{id:"asteria",name:"Asteria",capital:"Ibu kota Asteria",flag:"✦",region:"Jantung Elarion",status:"canon",description:"Kerajaan tempat Ryujin Lykaios dibesarkan. Kota Avelorn, perdagangan timur, pegunungan, hutan dan dataran menjadi panggung legenda Aeternia.",locations:["avelorn","eastern-trade","capital"],focus:true},
{id:"valemere",name:"Valemere",capital:"Elderport",flag:"◈",region:"Kerajaan Barat",status:"canon",description:"Kerajaan di barat Asteria. Elderport adalah ibu kotanya. Rincian sejarah, politik dan pemukimannya belum dibuka.",locations:["elderport"]},
{id:"nordheim",name:"Nordheim",capital:"Vinterhall",flag:"❄",region:"Kerajaan Utara",status:"canon",description:"Kerajaan utara Elarion dengan ibu kota Vinterhall. Informasi mengenai pemerintahannya masih tertutup dalam arsip.",locations:["vinterhall"]},
{id:"solarian",name:"Solarian",capital:"Aurendale",flag:"☼",region:"Kerajaan Timur",status:"canon",description:"Kerajaan yang membentang di timur Asteria. Aurendale tercatat sebagai ibu kota, namun detailnya belum terungkap.",locations:["aurendale"]},
{id:"rivermere",name:"Rivermere",capital:"Rivermouth",flag:"≋",region:"Kerajaan Selatan",status:"canon",description:"Kerajaan di selatan Asteria. Rivermouth menjadi ibu kotanya; sebagian besar rincian dalam kronik masih belum terpetakan.",locations:["rivermouth"]}
],
places:[
{id:"avelorn",name:"Avelorn",type:"Kota kecil",realm:"asteria",status:"canon",x:495,y:307,description:"Kota tempat Ryujin tumbuh, pusat Guild Avelorn dan kediaman Starhaven. Kota kecil yang hidup dari petualangan, kerajinan, pasar, dan penelitian Arcana.",details:"Perkiraan penduduk ±3.500–5.000. Diameter ilustratif ±2,8 km; empat gerbang kota. Sungai Astra melalui tepian selatan. Jangan tertukar dengan ibu kota Asteria.",tags:["Guild","Aeternia","Starhaven"],entry:true},
{id:"eastern-trade",name:"Kawasan Perdagangan Timur",type:"Kawasan dagang",realm:"asteria",status:"canon",x:811,y:339,description:"Kawasan perdagangan terpisah dari Avelorn; tempat Duskcrown Inn milik Elowen Veyra, Emberforge, dan bengkel Eamon.",details:"Rute cepat dari Avelorn ±60 km, ±3 jam namun berbahaya. Jalur dagang aman ±120 km, sekitar satu hari berkereta termasuk jeda. Waktu perjalanan tidak universal.",tags:["Duskcrown Inn","Emberforge","Hearthwind Voyager"],entry:true},
{id:"capital",name:"Ibu Kota Asteria",type:"Ibu kota kerajaan",realm:"asteria",status:"limited",x:588,y:560,description:"Pusat kerajaan Asteria, dikenal lewat perjalanan rombongan kerajaan dan upacara Royal Honors. Nama kota belum ditetapkan secara resmi.",details:"Penanda atlas 3 November menyebut kota ini belum dikunjungi. Kronik Day 420–423 memperbarui keadaan: Ryujin telah tiba dan menghadiri upacara kerajaan. Grand Asteria Royal Plaza adalah tempat upacara. Nama kota dan peta jalan rinci masih belum disahkan.",tags:["Royal Honors","Grand Asteria Royal Plaza"],entry:true},
{id:"elderport",name:"Elderport",type:"Ibu kota",realm:"valemere",status:"limited",description:"Ibu kota Valemere. Informasi detail masih terkunci hingga cerita membukanya.",details:"Keberadaan dan nama kota sudah canon."},
{id:"vinterhall",name:"Vinterhall",type:"Ibu kota",realm:"nordheim",status:"limited",description:"Ibu kota Nordheim; belum tersedia peta lokal resmi.",details:"Keberadaan dan nama kota sudah canon."},
{id:"aurendale",name:"Aurendale",type:"Ibu kota",realm:"solarian",status:"limited",description:"Ibu kota Solarian; belum tersedia peta lokal resmi.",details:"Keberadaan dan nama kota sudah canon."},
{id:"rivermouth",name:"Rivermouth",type:"Ibu kota",realm:"rivermere",status:"limited",description:"Ibu kota Rivermere; belum tersedia peta lokal resmi.",details:"Keberadaan dan nama kota sudah canon."},
{id:"starcrest",name:"Starcrest",type:"Rancangan kota",realm:"asteria",status:"concept",x:659,y:188,description:"Usulan kota dataran tinggi di kaki Pegunungan Bintang Utara, sebagai simpul petualangan baru.",details:"Belum canon; guild, penghuni, dan sejarah belum ditetapkan."},
{id:"silverbrook",name:"Silverbrook",type:"Rancangan desa",realm:"asteria",status:"concept",x:332,y:348,description:"Usulan desa di perbatasan Hutan Silverwood.",details:"Belum canon; penamaan dan peristiwa membutuhkan persetujuan pemain."},
{id:"ardenshire",name:"Ardenshire",type:"Rancangan kota",realm:"asteria",status:"concept",x:661,y:619,description:"Usulan kota dagang di Dataran Arden, bukan kota asal peserta turnamen yang telah dikonfirmasi.",details:"Belum canon; nama dan fungsi masih bisa diubah."},
{id:"mistfen",name:"Mistfen",type:"Rancangan desa",realm:"asteria",status:"concept",x:292,y:582,description:"Usulan desa kecil di sekitar Rawa Embun Perak.",details:"Belum canon; tidak menetapkan penduduk, suku, atau sejarah baru."},
{id:"northgate-hamlet",name:"Dusun Punggung Bintang",type:"Rancangan desa",realm:"asteria",status:"concept",x:380,y:182,description:"Usulan pemukiman pegunungan utara untuk pengembangan alur petualang dari cabang Guild lainnya.",details:"Belum canon. Nama, posisi, penduduk, dan seluruh lore memerlukan persetujuan pemain."},
{id:"ardenfield",name:"Ardenfield",type:"Rancangan kota",realm:"asteria",status:"concept",x:445,y:517,description:"Usulan kota agraris di Dataran Arden untuk memperkaya jejaring dagang Asteria.",details:"Belum canon. Nama, posisi, penduduk, dan seluruh lore memerlukan persetujuan pemain."},
{id:"lunaris-port",name:"Lunaris Crossing",type:"Rancangan kota",realm:"asteria",status:"concept",x:247,y:430,description:"Usulan kota transit di dekat Danau Lunaris.",details:"Belum canon. Tidak boleh diperlakukan sebagai kota yang sudah dimainkan."},
{id:"eastwatch",name:"Eastwatch",type:"Rancangan kota",realm:"asteria",status:"concept",x:855,y:208,description:"Usulan kota penghubung perbukitan timur untuk petualang dari wilayah lain.",details:"Belum canon. Penempatan dan nama dapat diganti."},
{id:"bayhaven",name:"Bayhaven",type:"Rancangan pelabuhan",realm:"asteria",status:"concept",x:835,y:581,description:"Usulan kota pelabuhan di Teluk Asteria.",details:"Belum canon. Tidak menyatakan adanya pelabuhan resmi di lokasi ini."}
],
avelorn:[
{id:"guild",name:"Guild Avelorn",type:"Guild & petualangan",x:493,y:259,description:"Pusat registrasi petualang dan papan misi. Darwin Elara adalah Guild Master Avelorn; Clara Wynthorne bekerja di administrasi. Fasilitas latihan berada di dekatnya."},
{id:"training",name:"Lapangan Latihan Guild",type:"Pelatihan",x:540,y:272,description:"Lapangan latihan yang berada di sisi Guild. Brom Aldric melatih teknik pertempuran Ryujin di sini."},
{id:"maelis",name:"Laboratorium Maelis Thorne",type:"Arcana & riset",x:701,y:235,description:"Tempat studi Arcana dan penelitian Maelis Thorne; berada di Distrik Sarjana."},
{id:"office",name:"Kantor Pemerintahan Avelorn",type:"Pemerintahan",x:455,y:400,description:"Pusat administrasi kota kecil. Bukan istana raja."},
{id:"garrick",name:"Bengkel Garrick Valen",type:"Bengkel",x:322,y:442,description:"Bengkel pandai besi Garrick Valen; berdampingan dengan rumah keluarga. Bukan Emberforge."},
{id:"valen",name:"Rumah Keluarga Valen",type:"Kediaman",x:300,y:478,description:"Rumah Garrick, Elena, dan Mira; tempat Ryujin dibesarkan. Bersebelahan dengan bengkel Garrick."},
{id:"scholar",name:"Distrik Sarjana",type:"Distrik",x:744,y:322,description:"Kawasan pembelajaran, laboratorium, dan aktivitas riset Arcana."},
{id:"market",name:"Pasar Sentral Avelorn",type:"Perdagangan",x:527,y:471,description:"Pusat aktivitas perdagangan rakyat, makanan, dan kebutuhan petualang."},
{id:"park",name:"Taman Kota Avelorn",type:"Taman",x:651,y:546,description:"Kawasan hijau untuk berjalan, beristirahat, dan berkumpul."},
{id:"nessa",name:"Pusat Perawatan Nessa Briar",type:"Perawatan",x:736,y:452,description:"Titik perawatan makhluk dan hewan magis pada atlas resmi. Detail layanan dan interior harus mengikuti episode."},
{id:"stag",name:"Penginapan Rusa Putih",type:"Penginapan",x:241,y:368,description:"Penginapan di dalam tembok Avelorn, kawasan barat. Berbeda dari Duskcrown Inn."},
{id:"kaela",name:"Rumah Kaela Thorn",type:"Kediaman",x:798,y:355,description:"Rumah Kaela di hunian timur, tepat berdekatan dengan rumah Oren."},
{id:"oren",name:"Rumah Oren Bell",type:"Kediaman",x:832,y:370,description:"Rumah Oren berdampingan dengan rumah Kaela."},
{id:"tarin",name:"Rumah Tarin Vale",type:"Kediaman",x:844,y:433,description:"Rumah Tarin masih berada di lingkungan hunian timur, tidak jauh dari Kaela dan Oren."},
{id:"starhaven",name:"Starhaven Residence",type:"Kediaman utama",x:746,y:618,description:"Kediaman Ryujin di sisi tenggara Avelorn. Rumah dua lantai, tiga kamar awal, ruang bengkel, arena latihan, taman, area kandang dan Hearthwind Voyager. Fasilitas tambahan berkembang dalam Part IV."},
{id:"warehouse7",name:"Gudang Utara #7",type:"Logistik & sejarah",x:605,y:147,description:"Titik misi F-054; berbeda dari Gudang #4 yang berada di Kawasan Perdagangan Timur."}
],
trade:[
{id:"duskcrown",name:"Duskcrown Inn",type:"Penginapan",x:510,y:335,description:"Penginapan milik dan dikelola Elowen Veyra. Tempat penting dalam kehidupan Ryujin dan El. Bukan Rusa Putih."},
{id:"emberforge",name:"Emberforge",type:"Bengkel",x:746,y:375,description:"Bengkel Bromdur Embervein tempat Silverfang dan Nightfall disempurnakan. Tidak berada di Avelorn."},
{id:"eamon",name:"Bengkel Eamon",type:"Bengkel kereta",x:388,y:518,description:"Lokasi pengerjaan dan perawatan kereta Hearthwind Voyager."},
{id:"warehouse4",name:"Gudang #4",type:"Gudang",x:809,y:521,description:"Titik tujuan pengawalan Durn Coppervein Hari 18. Berbeda dari Gudang Utara #7 Avelorn."}
],
terrain:[
{name:"Pegunungan Bintang Utara",x:450,y:111},{name:"Hutan Silverwood",x:233,y:269},{name:"Perbukitan Timur",x:847,y:129},{name:"Danau Lunaris",x:194,y:450},{name:"Dataran Arden",x:489,y:618},{name:"Rawa Embun Perak",x:182,y:600},{name:"Rimba Zamrud",x:344,y:679},{name:"Teluk Asteria",x:951,y:612}
],
chronicle:[
{day:"DAY 01",title:"Awal legenda di Avelorn",detail:"Avelorn menjadi titik mula perjalanan Ryujin Lykaios."},
{day:"DAY 12",title:"Perbukitan Timur",detail:"Ryujin menjumpai Astra dan Lumi di wilayah East Hills."},
{day:"DAY 16",title:"Aeternia didirikan",detail:"Ryujin, Kaela, Tarin, dan Oren menjadi satu tim petualang."},
{day:"DAY 18",title:"Jalur Perdagangan Timur",detail:"Perjalanan berbahaya yang menghubungkan Avelorn dengan kawasan dagang."},
{day:"DAY 390",title:"Starhaven Residence",detail:"Kediaman Starhaven diterima Ryujin di Avelorn setelah kepulangannya."},
{day:"DAY 420–423",title:"Kehormatan Kerajaan",detail:"Rombongan tiba di ibu kota Asteria; Ryujin menerima penghargaan kerajaan pada upacara publik."},
{day:"DAY 1540+",title:"The Grand Convergence",detail:"Arsip turnamen petualang Asteria sedang berkembang; kota asal para peserta lain belum semua ditetapkan dalam catatan geografis canon."}
]
};