# 테트리스

HTML, CSS, JavaScript만으로 만든 브라우저 테트리스 게임입니다.  
빌드 도구나 외부 라이브러리 없이 동작하며, [GitHub Pages](https://pages.github.com/)로 바로 배포할 수 있습니다.

## 프로젝트 소개

- **대상**: 프론트엔드 입문 학습용
- **기술 스택**: HTML, CSS, JavaScript (Vanilla)
- **보드 크기**: 10열 × 20행 (CSS Grid)
- **블록**: I, O, T, S, Z, J, L (7종)

게임 상태(보드, 점수, 현재 블록)는 JavaScript 변수로 관리하고, 화면은 `renderBoard()`로 그립니다.

## 실행 방법

### 로컬에서 바로 실행

1. 이 저장소를 클론하거나 폴더를 연다.
2. `index.html`을 더블클릭하거나 브라우저 창으로 드래그한다.
3. 빈 보드, 점수 `0`, **시작** / **재시작** 버튼, 조작법 안내가 보이면 성공이다.

### VS Code Live Server (선택)

1. VS Code에서 **Live Server** 확장을 설치한다.
2. `index.html` 우클릭 → **Open with Live Server**

### GitHub Pages에서 실행

배포 후 아래 주소 형식으로 접속한다.

- 사용자 사이트: `https://<사용자명>.github.io/`
- 프로젝트 사이트: `https://<사용자명>.github.io/<저장소명>/`

## 조작법

| 입력 | 동작 | 구현 상태 |
|------|------|-----------|
| **시작** 버튼 | 게임 시작 (자동 낙하) | ✅ |
| **재시작** 버튼 | 보드·점수·상태 초기화 후 재시작 | ✅ |
| ← → | 좌우 이동 | ⏳ 예정 |
| ↓ | 빠르게 내리기 | ⏳ 예정 |
| ↑ | 블록 회전 | ⏳ 예정 |
| Space | 즉시 낙하 | ⏳ 예정 |

> 화면의 키보드 조작 안내는 추후 구현 예정 기능입니다.

## 구현 기능

| 기능 | 설명 |
|------|------|
| 보드 렌더링 | 10×20 CSS Grid, 블록별 색상 |
| 블록 생성 | `createPiece()`, 7종 테트로미노 |
| 자동 낙하 | 800ms 간격 `setInterval` |
| 충돌 판정 | `canMove(piece, dx, dy, matrix)` — 벽·바닥·고정 블록 |
| 블록 고정 | 바닥/블록 충돌 시 `board`에 기록 |
| 줄 삭제 | 가득 찬 행 제거 후 위 블록 하강 |
| 점수 | 1줄 100 / 2줄 300 / 3줄 500 / 4줄 800 |
| 게임 오버 | 새 블록 스폰 불가 시 종료, UI 표시 |
| 재시작 | 보드, 점수, 타이머, 게임 오버 상태 초기화 |

## 품질 점검 방법

### 1. 수동 플레이 테스트

1. **시작** 클릭 → 블록이 자동으로 내려오는지 확인
2. 바닥에 닿으면 고정되고 새 블록이 나타나는지 확인
3. 한 줄을 가득 채우면 줄이 사라지고 점수가 오르는지 확인
4. 보드를 가득 채워 **게임 오버** 메시지와 낙하 정지 확인
5. **재시작** 후 보드·점수가 초기화되는지 확인
6. **시작**을 여러 번 눌러도 낙하 속도가 빨라지지 않는지 확인

### 2. 브라우저 개발자 도구

1. `F12` → **Console** 탭을 연다.
2. 페이지 로드 및 게임 플레이 중 빨간 에러가 없는지 확인한다.
3. **Network** 탭에서 `style.css`, `script.js`가 `200`으로 로드되는지 확인한다.

### 3. 구조 리뷰 (Cursor)

프로젝트에 포함된 커맨드를 사용할 수 있다.

- `/review-structure` — 파일 역할 분리, 초보자 친화성 검토
- `/review-game-logic` — 경계값·충돌 조건 검토

## GitHub Pages 배포 방법

### 사전 조건

- GitHub 계정
- 이 프로젝트가 GitHub 저장소에 push되어 있어야 한다.

### 1. 저장소 생성 및 push

```bash
git init
git add index.html style.css script.js README.md .gitignore
git commit -m "Initial commit: Tetris game"
git branch -M main
git remote add origin https://github.com/<사용자명>/<저장소명>.git
git push -u origin main
```

### 2. GitHub Pages 활성화

1. GitHub 저장소 → **Settings** → **Pages**
2. **Source**: Deploy from a branch
3. **Branch**: `main` / **Folder**: `/ (root)`
4. **Save** 클릭
5. 1~2분 후 표시되는 URL로 접속

### 3. 배포 확인

- 게임 보드가 보이는지
- **시작** 클릭 시 낙하가 동작하는지
- 콘솔에 404 (CSS/JS 미로드)가 없는지

### 배포 시 주의

- `index.html`, `style.css`, `script.js`는 **저장소 루트**에 있어야 한다.
- 경로는 상대 경로(`style.css`, `script.js`)를 사용하므로 별도 base URL 설정이 필요 없다.
- 빌드 단계가 없으므로 Actions 설정 없이 branch 배포만으로 충분하다.

## 파일 구성

| 파일 | 역할 |
|------|------|
| `index.html` | 화면 구조 (보드, 점수, 버튼, 조작법) |
| `style.css` | 레이아웃·보드·블록 색상 |
| `script.js` | 게임 로직 |
| `README.md` | 프로젝트 문서 |

## 배포용 커밋 가이드

### 커밋할 파일

| 파일 | 이유 |
|------|------|
| `index.html` | 앱 진입점 |
| `style.css` | 스타일 |
| `script.js` | 게임 로직 |
| `README.md` | 문서 |
| `.gitignore` | 불필요 파일 제외 (권장) |

### 제외할 파일

| 경로 | 이유 |
|------|------|
| `.cursor/` | Cursor IDE 전용 설정·커맨드 |
| `*.mjs`, `qa-*.js` | 로컬 테스트 스크립트 (있을 경우) |
| `.DS_Store`, `Thumbs.db` | OS 생성 파일 |
| `.env`, credentials | 비밀 정보 (현재 프로젝트에는 없음) |
