// 포트폴리오에 들어갈 모든 데이터 정의
const DATA = {
// 1. 트러블슈팅 데이터 (상세 보기 데이터 추가 버전)
    troubleshooting: [
        {
            id: "ts-01", // 고유 ID 추가
            title: "특정 집계 쿼리 타임아웃 발생 및 인덱스 재구성을 통한 개선",
            context: "대용량 결제 테이블에서 특정 기간 조회 시 5초 이상 소요되며 가끔 시스템 타임아웃 발생.",
            result: "조회 응답 속도 96% 개선 (5.2초 -> 0.2초), CPU Peak 부하 안정화.",
            code: SQL_QUERIES.ts01,
            
            // ⭐️ 디테일 버튼을 누르면 노출될 상세 정보들
            details: [
                {
                    subtitle: "🔍 문제 진단 및 원인 분석 과정 (Deep Dive)",
                    content: "오라클 AWR(Automatic Workload Repository) 보고서와 <code>EXPLAIN PLAN</code>을 통해 해당 쿼리가 <code>HASH JOIN</code> 및 <code>SORT MERGE JOIN</code>을 수행하는 과정에서 대규모 임시 세그먼트(Temp Segment)를 디스크에 쓰고 있는 것을 발견했습니다. 기존 인덱스는 컬럼의 카디널리티(선택도)를 고려하지 않고 <code>STATUS</code>가 선두 컬럼으로 잡혀 있어, 실제 범위 검색 조건인 <code>CREATED_AT</code>의 장점을 전혀 활용하지 못하고 Full Table Scan에 준하는 Cost가 발생하고 있었습니다."
                },
                {
                    subtitle: "🛠️ 튜닝 시나리오 및 검증 절차",
                    content: "1단계로 선두 컬럼을 범위 검색 조건인 <code>CREATED_AT</code>으로 변경한 복합 인덱스를 생성했습니다. 2단계로 오라클 옵티마이저가 올바른 인덱스를 강제 인지할 수 있도록 쿼리에 <code>INDEX</code> 힌트를 명시했습니다. 테스트 환경에서 1,500만 건의 더미 데이터를 적재한 후 스트레스 테스트를 수행한 결과, 블록 I/O(Logical Reads) 수치가 기존 대비 1/50 수준으로 급감하는 전 과정을 SQL Trace(tkprof)를 통해 정량적으로 검증 완료했습니다."
                }
            ]
        },
        {
            id: "ts-02", // 고유 ID 추가
            title: "text",
            context: "text",
            result: "text",
            code: SQL_QUERIES.ts02,
            
            // ⭐️ 디테일 버튼을 누르면 노출될 상세 정보들
            details: [
                {
                    subtitle: "🔍 text",
                    content: "text"
                },
                {
                    subtitle: "🛠️ text",
                    content: "text"
                }
            ]
        },
        {
            id: "ts-03", // 고유 ID 추가
            title: "text",
            context: "text",
            result: "text",
            code: SQL_QUERIES.ts03,
            
            // ⭐️ 디테일 버튼을 누르면 노출될 상세 정보들
            details: [
                {
                    subtitle: "🔍 text",
                    content: "text"
                },
                {
                    subtitle: "🛠️ text",
                    content: "text"
                }
            ]
        },
    ],
            

    // 2. 아키텍처 및 백서 데이터
    architecture: [
        {
            title: "Oracle High Availability 복제(Replication) 구축 및 Failover 테스트",
            summary: "Data Guard 기반의 Async 복제 구조를 설계하고, Primary DB 장애 발생 시 Standby DB가 무중단으로 역할을 이행하는지 검증한 보고서입니다.",
            tags: ["Oracle", "Data Guard", "Replication", "HA"],
            docLink: "https://blog.naver.com/10soong" // 상세 노션이나 깃허브 위키 링크용
        },
        {
            title: "RMAN을 이용한 Backup & Recovery 시나리오 검증 백서",
            summary: "물리적 디스크 손상 상태를 가상으로 시뮬레이션(Datafile 유실)한 후, RMAN 백업본과 Redo Log를 이용해 무손실 완전 복구(Complete Recovery) 프로세스 정립.",
            tags: ["Oracle", "RMAN", "Backup", "Recovery"],
            docLink: "https://blog.naver.com/10soong"
        }
    ],

    // 3. 외부 블로그 링크 데이터 (요청하신 기능 ⭐️)
   blogLogs: [   
       {
            date: "2026-06-25",
            title: "3회차 - 파이썬 제어문",
            summary: "기초 자료구조에 대한 이해와 if-elif 제어문을 통한 논리적 흐름 설계를 바탕으로, 업무 자동화 스크립트의 뼈대가 되는 데이터 입출력 제어, 형변환, 연산자 메커니즘 및 심화 문자열 처리 기술을 체계적으로 정리했습니다.",
            tags: ["Python"],
            link: "https://blog.naver.com/10soong/224327194820"
        },     
       {
            date: "2026-06-24",
            title: "2회차 - 파이썬 집합자료형",
            summary: "파이썬의 기초 서식과 문자열, 리스트, 튜플에 대한 이해를 바탕으로, 프로그래밍 프로토타이핑과 업무 자동화 스크립트의 뼈대가 되는 데이터 입출력 제어, 형변환(Type Casting), 연산자 메커니즘 및 심화 문자열 처리 기술을 체계적으로 정리했습니다.",
            tags: ["Python"],
            link: "https://blog.naver.com/10soong/224326086514"
        },
        {
            date: "2026-06-23",
            title: "1회차 - 파이썬 기초",
            summary: "프로그래밍 프로토타이핑과 자동화 스크립트의 기본이 되는 데이터 입출력 제어, 형변환(Type Casting), 연산자 메커니즘 및 문자열 처리 기초를 정리했습니다.",
            tags: ["Python"],
            link: "https://blog.naver.com/10soong/224324868806"
        },
           {
            date: "yyyy-mm-dd",
            title: "text",
            summary: "text",
            tags: ["Python"],
            link: "https://blog.naver.com/10soong"
        },
           {
            date: "yyyy-mm-dd",
            title: "text",
            summary: "text",
            tags: ["Python"],
            link: "https://blog.naver.com/10soong"
        },
           {
            date: "yyyy-mm-dd",
            title: "text",
            summary: "text",
            tags: ["Python"],
            link: "https://blog.naver.com/10soong"
        },
           {
            date: "yyyy-mm-dd",
            title: "text",
            summary: "text",
            tags: ["Python"],
            link: "https://blog.naver.com/10soong"
        },
           {
            date: "yyyy-mm-dd",
            title: "text",
            summary: "text",
            tags: ["Python"],
            link: "https://blog.naver.com/10soong"
        },
           {
            date: "yyyy-mm-dd",
            title: "text",
            summary: "text",
            tags: ["Python"],
            link: "https://blog.naver.com/10soong"
        },
           {
            date: "yyyy-mm-dd",
            title: "text",
            summary: "text",
            tags: ["Python"],
            link: "https://blog.naver.com/10soong"
        },
           {
            date: "yyyy-mm-dd",
            title: "text",
            summary: "text",
            tags: ["Python"],
            link: "https://blog.naver.com/10soong"
        },
           {
            date: "yyyy-mm-dd",
            title: "text",
            summary: "text",
            tags: ["Python"],
            link: "https://blog.naver.com/10soong"
        },
    ],
    album: [
        { id: "img-01", src: "image/1.jpg", title: "[취미활동]", comment: "25년 8월 홍대에서 일렉기타 포지션으로 공연" },
        { id: "img-02", src: "image/2.jpg", title: "[취미활동]", comment: "26년 2월 홍대에서 일렉기타 포지션으로 공연" },
        { id: "img-03", src: "image/3.jpg", title: "[취미활동]", comment: "26년 2월 공연후 단체사진" },
        { id: "img-04", src: "image/4.jpg", title: "[여가활동]", comment: "해외여행 : 몽골" },
        { id: "img-05", src: "image/5.jpg", title: "[여가활동]", comment: "전시회 : 아르떼뮤지엄" },
        { id: "img-06", src: "image/6.jpg", title: "[교내활동]", comment: "학생회 임원으로서 체육대회 기획 및 운영 마무리 후 단체사진" },
        { id: "img-07", src: "image/7.jpg", title: "[Learn & Run]", comment: "박찬권 저자의 오라클 SQL 파워업 출간 전 베타테스트 및 스터디 " },
        { id: "img-08", src: "image/8.jpg", title: "[Learn & Run]", comment: "지인들로 팀을 만들어 개발프로젝트 진행" },
        { id: "img-09", src: "image/9.jpg", title: "[Learn & Run]", comment: "스터디와 밸런스를 맞추며 에너지를 발산하는 풋살" }
    ]
};
