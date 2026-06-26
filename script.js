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

    // 트러블슈팅 카드의 인라인 버튼에서도 호출할 수 있도록 window 객체에 할당
    window.openSplitPanel = function(archId) {
        if (!DATA.architecture) return;
        const arch = DATA.architecture.find(a => a.id === archId);
        if (!arch) return;

        // 1. 백서 데이터 주입
        if (splitTitle) splitTitle.innerText = arch.title;
        if (splitBody) splitBody.innerHTML = arch.content;

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
    // 1. 트러블슈팅 섹션 (좌우 무한 순환 3D 휠 슬라이더)
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

                // ⭐️ 관련 백서 보기 버튼 조건부 렌더링
                let archBtnHtml = item.relatedArchId ? 
                    `<button onclick="window.openSplitPanel('${item.relatedArchId}')" class="text-xs bg-blue-500/10 hover:bg-blue-500/20 text-blue-400 px-3 py-1.5 rounded-md border border-blue-500/30 transition inline-flex items-center gap-1.5 cursor-pointer shadow-[0_0_10px_rgba(59,130,246,0.15)]"><i class="fas fa-network-wired text-[10px]"></i> 관련 백서 보기</button>` : '';

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
                                    <div id="code-wrapper-${item.id}" class="relative w-full rounded-lg bg-gray-950 border border-gray-800 overflow-hidden transition-all duration-500 ease-in-out [&::-webkit-scrollbar]:w-1.5 [&::-webkit-scrollbar-track]:bg-gray-950 [&::-webkit-scrollbar-thumb]:bg-gray-700 [&::-webkit-scrollbar-thumb]:rounded-full hover:[&::-webkit-scrollbar-thumb]:bg-gray-500" style="max-height: 160px;">
                                        <pre class="w-full max-w-full block p-4 pb-12 text-[10px] md:text-xs font-mono [&::-webkit-scrollbar]:h-1.5 [&::-webkit-scrollbar-track]:bg-transparent [&::-webkit-scrollbar-thumb]:bg-gray-700 [&::-webkit-scrollbar-thumb]:rounded-full hover:[&::-webkit-scrollbar-thumb]:bg-gray-500"><code class="language-sql">${item.code}</code></pre>
                                        <div id="code-fade-${item.id}" class="absolute bottom-0 left-0 w-full h-16 bg-gradient-to-t from-gray-950 to-transparent pointer-events-none transition-opacity duration-500"></div>
                                    </div>
                                </div>
                            </div>

                            <div id="details-${item.id}" class="max-h-0 overflow-hidden transition-all duration-500 ease-in-out">
                                <div class="py-2">
                                    ${detailsHtml}
                                </div>
                            </div>

                            <div class="mt-4 pt-4 border-t border-gray-800/40 flex flex-wrap justify-end gap-2">
                                ${archBtnHtml}
                                <button data-target="details-${item.id}" class="toggle-detail-btn text-xs bg-gray-800 hover:bg-gray-700 text-gray-300 px-3 py-1.5 rounded-md border border-gray-700 transition inline-flex items-center gap-1 cursor-pointer">
                                    <span>자세히 보기</span> <i class="fas fa-chevron-down text-[10px] transition-transform duration-300"></i>
                                </button>
                            </div>
                        </div>
                    </div>
                `;
                troubleContainer.innerHTML += phtml;
            }

            function closeAllDetails() {
                document.querySelectorAll(".toggle-detail-btn").forEach(btn => {
                    const targetId = btn.getAttribute("data-target");
                    const targetEl = document.getElementById(targetId);
                    if (!targetEl) return;
                    
                    const codeId = targetId.replace("details-", "");
                    const codeWrapper = document.getElementById(`code-wrapper-${codeId}`);
                    const codeFade = document.getElementById(`code-fade-${codeId}`);

                    const icon = btn.querySelector("i");
                    const btnText = btn.querySelector("span");

                    if (targetEl.style.maxHeight !== "" && targetEl.style.maxHeight !== "0px") {
                        targetEl.style.maxHeight = "0px";
                        
                        if (codeWrapper) {
                            codeWrapper.style.maxHeight = "160px";
                            codeWrapper.classList.remove("overflow-y-auto");
                            codeWrapper.classList.add("overflow-hidden");
                            codeWrapper.scrollTop = 0; 
                        }
                        if (codeFade) codeFade.style.opacity = "1";

                        if (icon) icon.style.transform = "rotate(0deg)";
                        if (btnText) btnText.innerText = "자세히 보기";
                        btn.classList.remove("bg-gray-700", "text-white");
                    }
                });
            }

            function updateTroubleSlider() {
                closeAllDetails(); 

                const cards = troubleContainer.querySelectorAll(".trouble-card");
                cards.forEach((card, idx) => {
                    let distance = idx - tCurrentPage;
                    
                    if (tTotalPages > 2) {
                        if (distance > tTotalPages / 2) distance -= tTotalPages;
                        else if (distance < -tTotalPages / 2) distance += tTotalPages;
                    } else if (tTotalPages === 2) {
                        if (tCurrentPage === 0 && idx === 1) distance = 1;
                        if (tCurrentPage === 1 && idx === 0) distance = -1;
                    }
                    
                    if (distance === 0) {
                        card.style.transform = "translate3d(0, 0, 0) rotateY(0deg) scale(1)";
                        card.style.opacity = "1";
                        card.style.zIndex = "10";
                        card.style.filter = "none";
                        card.style.pointerEvents = "auto";
                    } else if (distance === -1 || distance === 1) {
                        const side = distance;
                        card.style.transform = `translate3d(${side * 24}%, 0, -180px) rotateY(${-side * 28}deg) scale(0.85)`;
                        card.style.opacity = "0.35";
                        card.style.zIndex = "5";
                        card.style.filter = "blur(1.5px)";
                        card.style.pointerEvents = "none";
                    } else {
                        const side = distance > 0 ? 1 : -1;
                        card.style.transform = `translate3d(${side * 45}%, 0, -350px) rotateY(${-side * 45}deg) scale(0.7)`;
                        card.style.opacity = "0";
                        card.style.zIndex = "1";
                        card.style.filter = "blur(4px)";
                        card.style.pointerEvents = "none";
                    }
                });

                setTimeout(() => {
                    const activeCard = troubleContainer.children[tCurrentPage];
                    if (activeCard) troubleContainer.style.height = activeCard.offsetHeight + "px";
                }, 60);
                
                const indicatorText = `Page ${tCurrentPage + 1} / ${tTotalPages}`;
                if (troubleIndicator) troubleIndicator.innerText = indicatorText;
                if (troubleIndicatorMobile) troubleIndicatorMobile.innerText = indicatorText;
            }

            const tPrevButtons = [document.getElementById("trouble-prev"), document.getElementById("trouble-prev-mobile")];
            const tNextButtons = [document.getElementById("trouble-next"), document.getElementById("trouble-next-mobile")];

            tPrevButtons.forEach(btn => btn?.addEventListener("click", () => {
                tCurrentPage = (tCurrentPage - 1 + tTotalPages) % tTotalPages;
                updateTroubleSlider();
            }));

            tNextButtons.forEach(btn => btn?.addEventListener("click", () => {
                tCurrentPage = (tCurrentPage + 1) % tTotalPages;
                updateTroubleSlider();
            }));

            updateTroubleSlider();

            document.querySelectorAll(".toggle-detail-btn").forEach(btn => {
                btn.addEventListener("click", (e) => {
                    const currentBtn = e.currentTarget;
                    const targetId = currentBtn.getAttribute("data-target");
                    const targetEl = document.getElementById(targetId);
                    if (!targetEl) return;
                    
                    const codeId = targetId.replace("details-", "");
                    const codeWrapper = document.getElementById(`code-wrapper-${codeId}`);
                    const codeFade = document.getElementById(`code-fade-${codeId}`);

                    const icon = currentBtn.querySelector("i");
                    const btnText = currentBtn.querySelector("span");

                    if (targetEl.style.maxHeight === "" || targetEl.style.maxHeight === "0px") {
                        targetEl.style.maxHeight = targetEl.scrollHeight + "px";
                        if (codeWrapper) {
                            if (codeWrapper.scrollHeight > 500) {
                                codeWrapper.style.maxHeight = "500px";
                                codeWrapper.classList.remove("overflow-hidden");
                                codeWrapper.classList.add("overflow-y-auto");
                            } else {
                                codeWrapper.style.maxHeight = codeWrapper.scrollHeight + "px";
                            }
                        }
                        if (codeFade) codeFade.style.opacity = "0";
                        if (icon) icon.style.transform = "rotate(180deg)";
                        if (btnText) btnText.innerText = "접기";
                        currentBtn.classList.add("bg-gray-700", "text-white");
                        
                        setTimeout(() => {
                            const activeCard = troubleContainer.children[tCurrentPage];
                            if (activeCard) troubleContainer.style.height = activeCard.offsetHeight + "px";
                        }, 510);
                    } else {
                        targetEl.style.maxHeight = "0px";
                        if (codeWrapper) {
                            codeWrapper.style.maxHeight = "160px";
                            codeWrapper.classList.remove("overflow-y-auto");
                            codeWrapper.classList.add("overflow-hidden");
                            codeWrapper.scrollTop = 0; 
                        }
                        if (codeFade) codeFade.style.opacity = "1";
                        if (icon) icon.style.transform = "rotate(0deg)";
                        if (btnText) btnText.innerText = "자세히 보기";
                        currentBtn.classList.remove("bg-gray-700", "text-white");
                        
                        setTimeout(() => {
                            const activeCard = troubleContainer.children[tCurrentPage];
                            if (activeCard) troubleContainer.style.height = activeCard.offsetHeight + "px";
                        }, 510);
                    }
                });
            });
        }
    } catch (e) {
        console.error("Troubleshooting Error 예외 처리:", e);
    }

    // ==========================================
    // 2. 아키텍처 섹션 (버전 2: 가로축 스크롤 타임라인 + 마우스 휠 연동)
    // ==========================================
    try {
        const tlContainer = document.getElementById("arch-timeline-container");
        if (tlContainer && DATA.architecture) {
            let tlHtml = "";
            DATA.architecture.forEach((item, index) => {
                // 공간 절약을 위해 태그는 3개까지만 노출
                const tags = item.tags.slice(0, 3).map(t => `<span class="text-[10px] text-gray-400 bg-gray-800/80 px-2 py-0.5 rounded">#${t}</span>`).join("");
                
                tlHtml += `
                    <div onclick="window.openSplitPanel('${item.id}')" class="shrink-0 w-[280px] md:w-[320px] snap-start cursor-pointer group pb-4">
                        
                        <div class="flex flex-col items-center mb-4 relative">
                            <div class="w-12 h-12 rounded-full bg-gray-900 border-4 border-gray-800 flex items-center justify-center group-hover:border-blue-500 group-hover:bg-blue-500/10 transition z-10 shadow-lg">
                                <span class="text-xs font-bold text-gray-500 group-hover:text-blue-400 transition">${index + 1}</span>
                            </div>
                        </div>
                        
                        <div class="bg-gray-900 border border-gray-800 rounded-xl p-5 group-hover:border-blue-500/50 group-hover:bg-gray-800/50 transition relative mt-2 shadow-sm group-hover:shadow-md group-hover:-translate-y-1 transform duration-300">
                            <div class="absolute -top-[9px] left-1/2 -translate-x-1/2 w-0 h-0 border-l-[8px] border-r-[8px] border-b-[8px] border-l-transparent border-r-transparent border-b-gray-800 group-hover:border-b-blue-500/50 transition"></div>
                            
                            <h3 class="text-sm md:text-base font-bold text-white mb-2 line-clamp-2 group-hover:text-blue-400 transition">${item.title}</h3>
                            <div class="flex gap-1 mb-3 flex-wrap">${tags}</div>
                            <p class="text-gray-400 text-xs leading-relaxed line-clamp-3">${item.summary}</p>
                        </div>
                    </div>
                `;
            });
            tlContainer.innerHTML = tlHtml;

            // ⭐️ 마우스 휠 스크롤을 가로로 변환해주는 핵심 로직 ⭐️
            tlContainer.addEventListener("wheel", (e) => {
                // 마우스 세로 휠(deltaY) 움직임이 감지되었을 때
                if (e.deltaY !== 0) {
                    // 1. 기본 브라우저 스크롤(위아래로 화면 이동)을 차단
                    e.preventDefault(); 
                    
                    // 2. 그 수치만큼 컨테이너를 왼쪽/오른쪽으로 스크롤
                    tlContainer.scrollBy({
                        left: e.deltaY < 0 ? -150 : 150, // 한 번 휠을 굴릴 때마다 부드럽게 이동할 픽셀량
                        behavior: 'smooth' // 부드러운 스크롤 애니메이션 적용
                    });
                }
            }, { passive: false }); // preventDefault()를 사용하기 위한 필수 설정
        }
    } catch (e) {
        console.error("Architecture Timeline Error:", e);
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
