document.addEventListener("DOMContentLoaded", () => {
    // ==========================================
    // 1. 트러블슈팅 섹션 (좌우 무한 순환 3D 휠 슬라이더 - 자세히 보기 복구 완료)
    // ==========================================
    try {
        const troubleContainer = document.getElementById("trouble-container");
        const troubleIndicator = document.getElementById("trouble-indicator");
        const troubleIndicatorMobile = document.getElementById("trouble-indicator-mobile");
        
        if (troubleContainer && DATA.troubleshooting && DATA.troubleshooting.length > 0) {
            const tItemsPerPage = 1; 
            const tTotalItems = DATA.troubleshooting.length;
            const tTotalPages = Math.ceil(tTotalItems / tItemsPerPage);
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

                            <div class="mt-4 pt-4 border-t border-gray-800/40 flex justify-end">
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
                        btn.classList.remove("bg-blue-500/10", "text-blue-400", "border-blue-500/30");
                    }
                });
            }

            function updateTroubleSlider() {
                closeAllDetails(); 

                const cards = troubleContainer.querySelectorAll(".trouble-card");
                cards.forEach((card, idx) => {
                    let distance = idx - tCurrentPage;
                    
                    if (tTotalPages > 2) {
                        if (distance > tTotalPages / 2) {
                            distance -= tTotalPages;
                        } else if (distance < -tTotalPages / 2) {
                            distance += tTotalPages;
                        }
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
                    } else if (distance === -1) {
                        card.style.transform = "translate3d(-24%, 0, -180px) rotateY(28deg) scale(0.85)";
                        card.style.opacity = "0.35";
                        card.style.zIndex = "5";
                        card.style.filter = "blur(1.5px)";
                        card.style.pointerEvents = "none";
                    } else if (distance === 1) {
                        card.style.transform = "translate3d(24%, 0, -180px) rotateY(-28deg) scale(0.85)";
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
                    if (activeCard) {
                        troubleContainer.style.height = activeCard.offsetHeight + "px";
                    }
                }, 60);
                
                const indicatorText = `Page ${tCurrentPage + 1} / ${tTotalPages}`;
                if (troubleIndicator) troubleIndicator.innerText = indicatorText;
                if (troubleIndicatorMobile) troubleIndicatorMobile.innerText = indicatorText;
            }

            const tPrevButtons = [document.getElementById("trouble-prev"), document.getElementById("trouble-prev-mobile")];
            const tNextButtons = [document.getElementById("trouble-next"), document.getElementById("trouble-next-mobile")];

            tPrevButtons.forEach(btn => {
                if (btn) {
                    btn.addEventListener("click", () => {
                        tCurrentPage = (tCurrentPage - 1 + tTotalPages) % tTotalPages;
                        updateTroubleSlider();
                    });
                }
            });

            tNextButtons.forEach(btn => {
                if (btn) {
                    btn.addEventListener("click", () => {
                        tCurrentPage = (tCurrentPage + 1) % tTotalPages;
                        updateTroubleSlider();
                    });
                }
            });

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
                            const maxExpandedHeight = 500; 
                            if (codeWrapper.scrollHeight > maxExpandedHeight) {
                                codeWrapper.style.maxHeight = maxExpandedHeight + "px";
                                codeWrapper.classList.remove("overflow-hidden");
                                codeWrapper.classList.add("overflow-y-auto");
                            } else {
                                codeWrapper.style.maxHeight = codeWrapper.scrollHeight + "px";
                            }
                        }
                        if (codeFade) codeFade.style.opacity = "0";

                        if (icon) icon.style.transform = "rotate(180deg)";
                        if (btnText) btnText.innerText = "접기";
                        currentBtn.classList.add("bg-blue-500/10", "text-blue-400", "border-blue-500/30");
                        
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
                        currentBtn.classList.remove("bg-blue-500/10", "text-blue-400", "border-blue-500/30");
                        
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
    // 2. 아키텍처 백서 섹션
    // ==========================================
    try {
        const archContainer = document.getElementById("arch-container");
        if (archContainer && DATA.architecture) {
            archContainer.innerHTML = ""; 
            DATA.architecture.forEach(item => {
                const tagsHtml = item.tags.map(tag => `<span class="text-[10px] md:text-xs bg-gray-800 text-gray-400 px-2 py-0.5 rounded">${tag}</span>`).join("");
                archContainer.innerHTML += `
                    <div class="bg-gray-900 border border-gray-800 rounded-xl p-5 md:p-6 flex flex-col justify-between hover:border-blue-500/30 transition">
                        <div>
                            <div class="flex gap-1.5 mb-3 flex-wrap">${tagsHtml}</div>
                            <h3 class="text-base md:text-lg font-bold text-white mb-2 leading-snug">${item.title}</h3>
                            <p class="text-gray-400 text-xs md:text-sm leading-relaxed mb-4">${item.summary}</p>
                        </div>
                        <a href="${item.docLink}" target="_blank" class="text-xs md:text-sm text-blue-400 font-medium hover:underline inline-flex items-center gap-1 mt-auto">
                            백서 전문 보기 <i class="fas fa-arrow-right text-[10px] md:text-xs"></i>
                        </a>
                    </div>
                `;
            });
        }
    } catch (e) {
        console.error("Architecture Error 예외 처리:", e);
    }

    // ==========================================
    // 3. 블로그 로그 및 2x3 슬라이더 알고리즘
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

            const prevButtons = [document.getElementById("blog-prev"), document.getElementById("blog-prev-mobile")];
            const nextButtons = [document.getElementById("blog-next"), document.getElementById("blog-next-mobile")];

            prevButtons.forEach(btn => {
                if (btn) {
                    btn.addEventListener("click", () => {
                        if (currentPage > 0) {
                            currentPage--;
                            updateSlider();
                        }
                    });
                }
            });

            nextButtons.forEach(btn => {
                if (btn) {
                    btn.addEventListener("click", () => {
                        if (currentPage < totalPages - 1) {
                            currentPage++;
                            updateSlider();
                        }
                    });
                }
            });

            updateSlider();
        }
    } catch (e) {
        console.error("Blog Logs Error 예외 처리:", e);
    }

    // ==========================================
    // 4. 미니 앨범(Gallery) 및 내부 서핑 알고리즘 고도화 (⭐️ 좌우 이동 추가)
    // ==========================================
    try {
        const albumGrid = document.getElementById("album-grid");
        const galleryModal = document.getElementById("gallery-modal");
        const modalImg = document.getElementById("modal-img");
        const modalTitle = document.getElementById("modal-title");
        const modalComment = document.getElementById("modal-comment");
        const modalClose = document.getElementById("modal-close");
        
        // 새로 매핑된 모달 전용 제어 장치
        const modalPrev = document.getElementById("modal-prev");
        const modalNext = document.getElementById("modal-next");

        let currentAlbumIndex = 0; // 현재 열린 이미지 인덱스 상태 저장소

        // 모달 데이터 갱신 서브루틴
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
                    <div class="absolute inset-0 flex items-center justify-center text-gray-600 text-[10px] font-sans group-hover:text-blue-400 transition">
                        <i class="fas fa-image"></i>
                    </div>
                    <img src="${item.src}" alt="${item.title}" class="w-full h-full object-cover opacity-70 group-hover:opacity-100 transition duration-300" onerror="this.style.opacity='0';">
                `;

                itemElement.addEventListener("click", () => {
                    currentAlbumIndex = index; // 클릭된 슬롯 인덱스 동기화
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

        // 모달 내부◀ 왼쪽 버튼 클릭 이벤트 핸들러
        if (modalPrev) {
            modalPrev.addEventListener("click", (e) => {
                e.stopPropagation(); // 모달 바닥 닫힘 전파 차단
                if (DATA.album && DATA.album.length > 0) {
                    // 첫 이미지에서 이전 누르면 마지막 이미지로 순환
                    currentAlbumIndex = (currentAlbumIndex - 1 + DATA.album.length) % DATA.album.length;
                    updateModalData(currentAlbumIndex);
                }
            });
        }

        // 모달 내부▶ 오른쪽 버튼 클릭 이벤트 핸들러
        if (modalNext) {
            modalNext.addEventListener("click", (e) => {
                e.stopPropagation(); // 모달 바닥 닫힘 전파 차단
                if (DATA.album && DATA.album.length > 0) {
                    // 마지막 이미지에서 다음 누르면 첫 이미지로 순환
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
                // 빈 배경을 눌렀을 때만 닫히도록 바인딩 스코프 제한
                if (e.target === galleryModal) closeModal(); 
            });
        }
    } catch (e) {
        console.error("Album & Modal Elements 예외 처리:", e);
    }

    // ==========================================
    // 5. 구문 강조 모듈 로드 검증
    // ==========================================
    try {
        if (typeof hljs !== 'undefined') {
            hljs.highlightAll();
        }
    } catch (e) {
        console.error("Highlight.js 모듈 로드 누락 예외 처리:", e);
    }
});
