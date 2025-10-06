<div class="fixed bottom-0 left-0 right-0 z-40 bg-gradient-to-r from-brand-orange to-brand-yellow">
   <button aria-label="Fechar" class="absolute right-0 top-0 p-2">
      <svg stroke="currentColor" fill="none" stroke-width="2" viewBox="0 0 24 24" stroke-linecap="round" stroke-linejoin="round" class="text-zinc-900" height="1em" width="1em" xmlns="http://www.w3.org/2000/svg">
         <line x1="18" y1="6" x2="6" y2="18"></line>
         <line x1="6" y1="6" x2="18" y2="18"></line>
      </svg>
   </button>
   <div class="py-2 px-5 max-w-8xl mx-auto flex items-center flex-wrap">
      <div class="flex items-center justify-between min-[640px]:w-1/5 md:w-auto">
         <button aria-label="Ir para o áudio anterior" class="p-2 cursor-pointer flex">
            <svg stroke="currentColor" fill="currentColor" stroke-width="0" viewBox="0 0 24 24" color="white" height="20" width="20" xmlns="http://www.w3.org/2000/svg" style="color: white;">
               <path fill="none" d="M0 0h24v24H0z"></path>
               <path d="M6 6h2v12H6zm3.5 6l8.5 6V6z"></path>
            </svg>
         </button>
         <button aria-label="Pausar ou reproduzir áudio" class="w-14 h-14 cursor-pointer bg-brand-yellow flex items-center justify-center rounded-full">
            <svg stroke="currentColor" fill="currentColor" stroke-width="0" viewBox="0 0 24 24" class="text-zinc-900" height="25" width="25" xmlns="http://www.w3.org/2000/svg">
               <path fill="none" d="M0 0h24v24H0z"></path>
               <path d="M8 5v14l11-7z"></path>
            </svg>
         </button>
         <button aria-label="Ir para o próximo áudio" class="p-2 cursor-pointer flex">
            <svg stroke="currentColor" fill="currentColor" stroke-width="0" viewBox="0 0 24 24" color="white" height="20" width="20" xmlns="http://www.w3.org/2000/svg" style="color: white;">
               <path fill="none" d="M0 0h24v24H0z"></path>
               <path d="M6 18l8.5-6L6 6v12zM16 6v12h2V6h-2z"></path>
            </svg>
         </button>
      </div>
      <div class="px-4 w-3/5 min-[640px]:w-4/5 md:w-auto">
         <p class="mb-[1px] text-white">Martins</p>
         <p class="opacity-50 text-[14px] text-white">Vozes Masculinas</p>
      </div>
      <div class="flex flex-1 pr-5 md:px-5 ml-auto max-w-[800px] items-center gap-4 text-white w-2/3">
         <p>0:00</p>
         <div class="w-full h-4 flex items-center cursor-pointer">
            <div class="bg-white/20 rounded h-1 w-full">
               <div class="bg-white h-1 rounded relative pointer-events-none" style="width: 0.448737%;">
                  <div class="absolute right-0 -top-1 h-3 w-3 bg-white rounded-full hover:ring-8 ring-white/20 transition"></div>
               </div>
            </div>
         </div>
         <p>1:29</p>
      </div>
      <div class="ml-auto flex items-center gap-4">
         <div class="hidden lg:block">
            <div class="flex items-center gap-2 w-[120px]">
               <div class="flex-1 h-4 flex items-center cursor-pointer transition-all duration-300 opacity-0 pointer-events-none">
                  <div class="bg-white/20 rounded h-1 w-full">
                     <div class="bg-white h-1 rounded relative pointer-events-none" style="width: 100%;">
                        <div class="absolute right-0 -top-1 h-3 w-3 bg-white rounded-full hover:ring-8 ring-white/20 transition"></div>
                     </div>
                  </div>
               </div>
               <button class="text-white transition rounded-full transition" aria-label="Silenciar">
                  <svg stroke="currentColor" fill="currentColor" stroke-width="0" viewBox="0 0 24 24" aria-hidden="true" height="22" width="22" xmlns="http://www.w3.org/2000/svg">
                     <path d="M13.5 4.06c0-1.336-1.616-2.005-2.56-1.06l-4.5 4.5H4.508c-1.141 0-2.318.664-2.66 1.905A9.76 9.76 0 001.5 12c0 .898.121 1.768.35 2.595.341 1.24 1.518 1.905 2.659 1.905h1.93l4.5 4.5c.945.945 2.561.276 2.561-1.06V4.06zM18.584 5.106a.75.75 0 011.06 0c3.808 3.807 3.808 9.98 0 13.788a.75.75 0 11-1.06-1.06 8.25 8.25 0 000-11.668.75.75 0 010-1.06z"></path>
                     <path d="M15.932 7.757a.75.75 0 011.061 0 6 6 0 010 8.486.75.75 0 01-1.06-1.061 4.5 4.5 0 000-6.364.75.75 0 010-1.06z"></path>
                  </svg>
               </button>
            </div>
         </div>
         <div>
            <a class="cursor-pointer rounded-full flex justify-center items-center font-bold text-sm hover:ring-4 focus:ring-4 focus:outline-none transition bg-zinc-900 ring-zinc-500/50 text-zinc-100" role="button">
               <span class="py-[10px] px-6">
                  <span class="flex gap-2 items-center">
                     Baixar Áudio
                     <svg stroke="currentColor" fill="none" stroke-width="2" viewBox="0 0 24 24" stroke-linecap="round" stroke-linejoin="round" height="14" width="14" xmlns="http://www.w3.org/2000/svg">
                        <polyline points="8 17 12 21 16 17"></polyline>
                        <line x1="12" y1="12" x2="12" y2="21"></line>
                        <path d="M20.88 18.09A5 5 0 0 0 18 9h-1.26A8 8 0 1 0 3 16.29"></path>
                     </svg>
                  </span>
               </span>
            </a>
         </div>
      </div>
   </div>
   <audio src="https://firebasestorage.googleapis.com/v0/b/dashboard-glc.appspot.com/o/mdv_bdv_masculinas%2FMartins.mp3_4B5lyUB48mKRkdOB3Who.mp3?alt=media&amp;token=f6083115-4feb-422b-b1e3-b9eb3a8c7387"></audio>
</div>
