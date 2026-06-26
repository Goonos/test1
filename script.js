document.addEventListener("DOMContentLoaded", () => {
    
    // ==========================================
    // 💡 스플릿 스크린 (백서 패널) 글로벌 제어 함수
    // ==========================================
    const mainWrapper = document.getElementById("main-wrapper");
    const mainNav = document.getElementById("main-nav");
    const splitPanel = document.getElementById("split-panel");
    const splitCloseBtn = document.getElementById("split-panel-close");
    const splitTitle = document.getElementById("split-panel-title");
    const splitBody = document.getElementById("split-panel-body");
    const splitIcon = document.getElementById("split-panel-icon"); // ⭐️ 아이콘 요소 추가

    // 트러블슈팅 카드의 인라인 버튼에서도 호출할 수 있도록 window 객체에 할당
    window.openSplitPanel = function(archId) {
        if (!DATA.architecture) return;
        const arch = DATA.architecture.find(a => a.id === archId);
        if (!arch) return;

        // 1. 백서 데이터 주입 (타이틀, 본문, 그리고 아이콘)
        if (splitTitle) splitTitle.innerText = arch.title;
        if (splitBody) splitBody.innerHTML = arch.content;
        if (splitIcon && arch.icon) {
            // ⭐️ 해당 카드의 고유 아이콘으로 클래스 변경
            splitIcon.className = arch.icon + " text-blue-400 text-lg md:text-xl shrink-0";
        }

        // 2. 스플릿 애니메이션 클래스 부착 (화면 분할)
        if (mainWrapper) mainWrapper.classList.add("split-active-main");
        if (mainNav) mainNav.classList.add("split-active-nav");
        if (splitPanel) splitPanel.classList.add("split-active-panel");

        // 3. 아키텍처 섹션으로 부드럽게 화면 스크롤 이동
        document.getElementById("architecture").scrollIntoView({ behavior: 'smooth', block: 'start' });
        
        // 4. 백서 내부에 코드가 있다면 구문 강조 다시 적용
        setTimeout(() => {
            if (typeof hljs !== 'undefined') {
                document.querySelectorAll('#split-panel-body pre code').forEach((block) => {
                    hljs.highlightElement(block);
                });
            }
        }, 100);
    };

    window.closeSplitPanel = function() {
        if (mainWrapper) mainWrapper.classList.remove("split-active-main");
        if (mainNav) mainNav.classList.remove("split-active-nav");
        if (splitPanel) splitPanel.classList.remove("split-active-panel");
        
        // 닫을 때 내부 내용 비우기 (잔상 방지)
        setTimeout(() => {
            if (splitBody) splitBody.innerHTML = "";
        }, 500);
    };

    if (splitCloseBtn) {
        splitCloseBtn.addEventListener("click", window.closeSplitPanel);
    }


    // ==========================================
    // 1. 트러블슈팅 섹션 (관련 백서 링크 삭제 버전)
    // ==========================================
    try {
        const troubleContainer = document.getElementById("trouble-container");
        const troubleIndicator = document.getElementById("trouble-indicator");
        const troubleIndicatorMobile = document.getElementById("trouble-indicator-mobile");
        
        if (troubleContainer && DATA.troubleshooting && DATA.troubleshooting.length > 0) {
            const tTotalPages = DATA.troubleshooting.length;
            let tCurrentPage = 0;

            troubleContainer.innerHTML = ""; 
            troubleContainer.style.perspective = "1200px";
            troubleContainer.style.transformStyle = "preserve-3d";
            troubleContainer.className = "relative w-full transition-all duration-500 ease-in-out";

            for (let i = 0; i < tTotalPages; i++) {
                const item = DATA.troubleshooting[i];
                if (!item) continue;
                
                let detailsHtml = "";
                if (item.details && item.details.length > 0) {
                    item.details.forEach(det => {
                        detailsHtml += `
                            <div class="mt-4 border-t border-gray-800/80 pt-4">
                                <h4 class="text-xs md:text-sm font-bold text-blue-400 mb-1.5">${det.subtitle}</h4>
                                <p class="text-gray-400 text-xs md:text-sm leading-relaxed">${det.content}</p>
                            </div>
                        `;
                    });
                }

                // ⭐️ 관련 백서 보기 버튼 로직 삭제 (깔끔한 UI 구성)
                let phtml = `
                    <div id="trouble-card-${i}" class="trouble-card absolute inset-x-0 mx-auto w-[92%] md:w-[76%] transition-all duration-500 ease-in-out origin-center select-none" style="opacity: 0; pointer-events: none; backface-visibility: hidden;">
                        <div class="bg-gray-800 border border-gray-700 rounded-xl p-5 md:p-6 w-full min-w-0 overflow-hidden flex flex-col shadow-2xl">
                            <h3 class="text-lg md:text-xl font-bold text-white mb-4 flex flex-col md:flex-row md:items-center gap-2 items-start w-full min-w-0">
                                <span class="text-[10px] md:text-xs bg-red-500/10 text-red-400 px-2.5 py-1 rounded-full font-mono font-normal whitespace-nowrap shrink-0">Issue</span> 
                                <span class="leading-snug break-all">${item.title}</span>
                            </h3>
                            
                            <div class="flex flex-col gap-4 md:gap-5 text-xs md:text-sm leading-relaxed text-gray-300 w-full min-w-0">
                                <p class="m-0"><strong class="text-blue-400">🚨 현상 (Context):</strong><br>${item.context}</p>
                                <p class="m-0"><strong class="text-emerald-400">📈 결과 (Result):</strong><br>${item.result}</p>
                                
                                <div class="min-w-0 w-full flex flex-col m-0">
                                    <strong class="text-purple-400 block mb-2">💻 수정된 쿼리:</strong>
                                    <div id="code-wrapper-${item.id}" class="relative w-full rounded-lg bg-gray-950 border border-gray-800 overflow-hidden transition-all duration-500 ease-in-out" style="max-height: 160px;">
                                        <pre class="w-full max-w-full block p-4 pb-12 text-[10px] md:text-xs font-mono"><code class="language-sql">${item.code}</code></pre>
                                        <div id="code-fade-${item.id}" class="absolute bottom-0 left-0 w-full h-16 bg-gradient-to-t from-gray-950 to-transparent pointer-events-none transition-opacity duration-500"></div>
                                    </div>
                                </div>
                            </div>

                            <div id="details-${item.id}" class="max-h-0 overflow-hidden transition-all duration-500 ease-in-out">
                                <div class="py-2">
                                    ${detailsHtml}
                                </div>
                            </div>

                            <div class="mt-4 pt-4 border-t border-gray-800/40 flex justify-end">
                                <button data-target="details-${item.id}" class="toggle-detail-btn text-xs bg-gray-800 hover:bg-gray-700 text-gray-300 px-4 py-2 rounded-md border border-gray-700 transition inline-flex items-center gap-1.5 cursor-pointer">
                                    <span>자세히 보기</span> <i class="fas fa-chevron-down text-[10px] transition-transform duration-300"></i>
                                </button>
                            </div>
                        </div>
                    </div>
                `;
                troubleContainer.innerHTML += phtml;
            }
            // ... (하단 updateTroubleSlider 및 이벤트 리스너 로직은 그대로 유지)
        }
    } catch (e) {
        console.error("Troubleshooting Error:", e);
    }

    // ==========================================
    // 2. 아키텍처 섹션 (2x2 그리드 -> 스플릿 시 1x4 압축 반응형 구조)
    // ==========================================
    try {
        const quadContainer = document.getElementById("arch-quadrant-container");
        if (quadContainer && DATA.architecture) {
            let quadHtml = "";
            DATA.architecture.forEach((item, index) => {
                const tags = item.tags.map(t => `<span class="text-[10px] text-blue-400 bg-blue-500/10 px-2 py-0.5 rounded border border-blue-500/20 font-mono">#${t}</span>`).join("");
                
                quadHtml += `
                    <div onclick="window.openSplitPanel('${item.id}')" class="arch-card w-full bg-gray-900/80 backdrop-blur-sm border border-gray-800 rounded-2xl p-6 hover:border-blue-500/40 hover:bg-gray-800 transition-all duration-300 cursor-pointer group shadow-lg hover:shadow-[0_0_30px_rgba(59,130,246,0.15)] relative overflow-hidden flex flex-col justify-between h-full min-h-[200px] md:min-h-[220px]">
                        
                        <div class="absolute -inset-full bg-gradient-to-r from-blue-500/0 via-blue-500/5 to-blue-500/0 opacity-0 group-hover:opacity-100 transition duration-500 blur-2xl z-0"></div>
                        
                        <i class="${item.icon} absolute -bottom-4 -right-4 text-7xl md:text-[7rem] text-gray-800/20 group-hover:text-blue-500/5 transition duration-500 transform group-hover:scale-110 z-0"></i>

                        <div class="relative z-10">
                            <div class="arch-header flex items-center gap-3 md:gap-4 mb-4 pb-4 border-b border-gray-800/80 transition-all duration-300">
                                <div class="w-11 h-11 rounded-full bg-blue-500/10 border border-blue-500/30 flex items-center justify-center shrink-0 group-hover:bg-blue-500/20 transition shadow-inner">
                                    <i class="${item.icon} text-lg text-blue-400"></i>
                                </div>
                                <div class="flex flex-col justify-center">
                                    <strong class="text-lg md:text-xl font-black text-transparent bg-clip-text bg-gradient-to-r from-white to-gray-400 tracking-wide">${item.pillar}</strong>
                                </div>
                            </div>
                            
                            <h3 class="arch-title text-sm md:text-base font-bold text-gray-200 mb-2 transition-all duration-300">${item.title}</h3>
                            <p class="arch-summary text-gray-400 text-xs md:text-sm leading-relaxed mb-5 transition-all duration-300">${item.summary}</p>
                            <div class="flex gap-1.5 flex-wrap">${tags}</div>
                        </div>
                    </div>
                `;
            });
            quadContainer.innerHTML = quadHtml;
        }
    } catch (e) {
        console.error("Architecture Quadrant Error:", e);
    }

    // ==========================================
    // 3. 블로그 로그 (2x3 슬라이더)
    // ==========================================
    try {
        const blogContainer = document.getElementById("blog-container");
        const blogIndicator = document.getElementById("blog-indicator");
        const blogIndicatorMobile = document.getElementById("blog-indicator-mobile");
        
        if (blogContainer && DATA.blogLogs && DATA.blogLogs.length > 0) {
            const itemsPerPage = 6;
            const totalItems = DATA.blogLogs.length;
            const totalPages = Math.ceil(totalItems / itemsPerPage);
            let currentPage = 0;

            blogContainer.innerHTML = "";

            for (let i = 0; i < totalPages; i++) {
                const startIdx = i * itemsPerPage;
                const endIdx = Math.min(startIdx + itemsPerPage, totalItems);
                const chunk = DATA.blogLogs.slice(startIdx, endIdx);

                let pageHtml = `<div class="w-full shrink-0 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 gap-4 px-1 box-border">`;

                chunk.forEach(item => {
                    const tagsHtml = item.tags.map(tag => `<span class="text-[10px] text-blue-400 bg-blue-500/5 px-2 py-0.5 rounded font-mono break-keep">#${tag}</span>`).join(" ");
                    pageHtml += `
                        <div class="bg-gray-800/30 border border-gray-800 rounded-lg p-4 flex flex-col justify-between hover:bg-gray-800/50 transition h-44">
                            <div>
                                <span class="text-[10px] md:text-xs text-gray-500 font-mono">${item.date}</span>
                                <h3 class="text-sm md:text-base font-bold text-white mt-1 mb-1.5 line-clamp-1">${item.title}</h3>
                                <p class="text-gray-400 text-xs leading-relaxed mb-2 line-clamp-2">${item.summary}</p>
                            </div>
                            <div class="flex justify-between items-center mt-auto pt-2 border-t border-gray-800/50">
                                <div class="flex flex-wrap gap-1">${tagsHtml}</div>
                                <a href="${item.link}" target="_blank" class="text-[10px] md:text-xs text-gray-400 hover:text-blue-400 font-medium flex items-center gap-1 shrink-0 ml-2">
                                    원문 ↗
                                </a>
                            </div>
                        </div>
                    `;
                });

                pageHtml += `</div>`;
                blogContainer.innerHTML += pageHtml;
            }

            function updateSlider() {
                const offset = currentPage * 100;
                if (blogContainer) blogContainer.style.transform = `translateX(-${offset}%)`;

                const indicatorText = `Page ${currentPage + 1} / ${totalPages}`;
                if (blogIndicator) blogIndicator.innerText = indicatorText;
                if (blogIndicatorMobile) blogIndicatorMobile.innerText = indicatorText;
            }

            [document.getElementById("blog-prev"), document.getElementById("blog-prev-mobile")].forEach(btn => {
                btn?.addEventListener("click", () => {
                    if (currentPage > 0) { currentPage--; updateSlider(); }
                });
            });

            [document.getElementById("blog-next"), document.getElementById("blog-next-mobile")].forEach(btn => {
                btn?.addEventListener("click", () => {
                    if (currentPage < totalPages - 1) { currentPage++; updateSlider(); }
                });
            });

            updateSlider();
        }
    } catch (e) {
        console.error("Blog Logs Error 예외 처리:", e);
    }

    // ==========================================
    // 4. 미니 앨범 (Gallery 모달)
    // ==========================================
    try {
        const albumGrid = document.getElementById("album-grid");
        const galleryModal = document.getElementById("gallery-modal");
        const modalImg = document.getElementById("modal-img");
        const modalTitle = document.getElementById("modal-title");
        const modalComment = document.getElementById("modal-comment");
        const modalClose = document.getElementById("modal-close");
        const modalPrev = document.getElementById("modal-prev");
        const modalNext = document.getElementById("modal-next");

        let currentAlbumIndex = 0;

        function updateModalData(idx) {
            const currentItem = DATA.album[idx];
            if (!currentItem) return;
            if (modalImg) modalImg.src = currentItem.src;
            if (modalTitle) modalTitle.textContent = currentItem.title;
            if (modalComment) modalComment.innerHTML = currentItem.comment;
        }

        if (albumGrid && DATA.album) {
            albumGrid.innerHTML = ""; 
            DATA.album.forEach((item, index) => {
                const itemElement = document.createElement("div");
                itemElement.className = "relative aspect-square bg-gray-900 border border-gray-700/60 rounded-lg overflow-hidden cursor-pointer group hover:border-blue-500 transition shadow-inner";
                
                itemElement.innerHTML = `
                    <div class="absolute inset-0 flex items-center justify-center text-gray-600 text-[10px] font-sans group-hover:text-blue-400 transition z-10">
                        <i class="fas fa-image"></i>
                    </div>
                    <img src="${item.src}" alt="${item.title}" class="absolute inset-0 w-full h-full object-cover opacity-70 group-hover:opacity-100 transition duration-300 z-20" onerror="this.style.opacity='0';">
                `;

                itemElement.addEventListener("click", () => {
                    currentAlbumIndex = index;
                    updateModalData(currentAlbumIndex);
                    
                    if (galleryModal) {
                        galleryModal.classList.remove("hidden");
                        galleryModal.classList.add("flex");
                    }
                    document.body.style.overflow = "hidden";
                });

                albumGrid.appendChild(itemElement);
            });
        }

        if (modalPrev) {
            modalPrev.addEventListener("click", (e) => {
                e.stopPropagation(); 
                if (DATA.album && DATA.album.length > 0) {
                    currentAlbumIndex = (currentAlbumIndex - 1 + DATA.album.length) % DATA.album.length;
                    updateModalData(currentAlbumIndex);
                }
            });
        }

        if (modalNext) {
            modalNext.addEventListener("click", (e) => {
                e.stopPropagation(); 
                if (DATA.album && DATA.album.length > 0) {
                    currentAlbumIndex = (currentAlbumIndex + 1) % DATA.album.length;
                    updateModalData(currentAlbumIndex);
                }
            });
        }

        if (modalClose && galleryModal) {
            const closeModal = () => {
                galleryModal.classList.add("hidden");
                galleryModal.classList.remove("flex");
                document.body.style.overflow = "";
            };
            modalClose.addEventListener("click", closeModal);
            galleryModal.addEventListener("click", (e) => { 
                if (e.target === galleryModal) closeModal(); 
            });
        }
    } catch (e) {
        console.error("Album & Modal Elements 예외 처리:", e);
    }

    // ==========================================
    // 5. 구문 강조(Highlight.js) 모듈 최초 로드
    // ==========================================
    try {
        if (typeof hljs !== 'undefined') {
            hljs.highlightAll();
        }
    } catch (e) {
        console.error("Highlight.js 모듈 로드 누락 예외 처리:", e);
    }
});
