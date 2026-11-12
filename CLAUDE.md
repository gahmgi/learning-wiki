# loglab study wiki - 작업 지침

공부한 것을 표와 흐름으로 정리해 두는 개인 위키입니다. Astro Starlight로 만들고, `dist/`만 정적 호스팅에 배포합니다.
첫 주제는 게임 개발과 AI 아트 파이프라인입니다.

**주소는 `/wiki/` 아래에 둡니다.** 나중에 `/`에 홈페이지가 들어와도 원 노트에 덧붙인 위키 링크가 깨지지 않게 하려는 것입니다.
지금은 `/`가 `/wiki/`로 리다이렉트됩니다(`astro.config.mjs`). 이 구조는 첫 발행 이후 바꾸지 않습니다.

## 1. 계정 (가장 먼저 확인)

- 개인 저장소입니다. 원격은 `github.com/gahmgi/learning-wiki`(비공개)로 둡니다. 첫 푸시 전에는 원격이 없습니다.
- 커밋 이메일은 `gahmhg@gmail.com`만 씁니다. 회사 이메일은 쓰지 않습니다.
  `hooks/pre-commit`이 작성자·커미터를 검사하고, 다르면 커밋을 멈춥니다.
- 새 클론에서는 아래를 한 번 실행합니다.
  ```sh
  git config --local user.name "hyungkee gahm"
  git config --local user.email gahmhg@gmail.com
  git config --local core.hooksPath hooks
  ```
- 푸시 자격증명은 원격 URL 소유자(`gahmgi`)를 보고 개인 계정으로 자동으로 붙습니다. `gh auth switch`는 필요 없습니다.
  확인: `git config --get-urlmatch credential.helper https://github.com/gahmgi/learning-wiki`

## 2. 이식성 규칙 (Netlify → Cloudflare Pages 이전 대비)

나중에 워크노트와 함께 Cloudflare Pages로 옮깁니다. 어느 정적 호스트에서도 같은 결과가 나와야 합니다.

| 규칙 | 이유 |
|---|---|
| 빌드는 `npm run build` → `dist/` 그대로 | 호스트 설정이 "빌드 명령 + 배포 폴더" 두 칸이면 끝나도록 |
| `dist/`만 배포. 저장소 루트를 배포 폴더로 두지 않음 | `CLAUDE.md`·원 노트 ID 등 작업 파일이 공개되지 않도록 |
| Netlify 전용 기능 금지: Functions, Forms, Identity, `netlify.toml`, `_redirects`, `_headers` | 옮길 때 다시 만들 일이 없도록 |
| 리다이렉트는 `astro.config.mjs`의 `redirects`에만 | Astro가 정적 HTML로 만들어 어느 호스트에서든 동작 |
| 클라이언트 JS가 필요한 부품을 만들지 않음 | 정적 HTML·CSS만으로 그려지도록 |

비밀번호 보호가 필요해지면 코드가 아니라 **호스트 대시보드**에서 겁니다.
Netlify는 Pro 플랜의 Project visibility, Cloudflare는 Access입니다.

## 3. 페이지 틀

### 위치

| 카테고리 | 폴더 |
|---|---|
| 파이프라인 | `src/content/docs/wiki/pipeline/` |
| 도구 | `src/content/docs/wiki/tools/` |
| 법·정책 | `src/content/docs/wiki/law-policy/` |
| 조직·직무 | `src/content/docs/wiki/org-roles/` |
| 디자인 | `src/content/docs/wiki/design/` |

- 카테고리는 페이지가 하나라도 생겨야 사이드바에 나옵니다(`astro.config.mjs`의 `hasPages`). 빈 개요 페이지를 미리 만들지 않습니다.
- 새 카테고리를 더하면 `astro.config.mjs`의 `CATEGORIES`와 `src/lib/meta.ts`의 `CATEGORY_LABELS` 두 곳에 한 줄씩 넣습니다.

파일 이름은 영문 소문자와 하이픈으로 짓습니다(주소가 됩니다). 제목은 머리말 `title`에 한국어로 씁니다.

### 머리말 (빠지면 빌드 실패)

```yaml
---
title: 페이지 제목
description: 제목 아래 리드 문장. 이 페이지의 결론 한두 문장.
origin: worknote        # worknote(WorkNote에서 발행, 기본값) | wiki(위키에서 직접 작성)
worknote_id: <WorkNote 원 노트 UUID>   # origin: worknote 일 때만 필수
status: 무엇을 확인했고 무엇을 아직 안 봤는지 한 문장
learned: 2026-11-11
sources:
  - title: 자료 이름 (발행일)
    url: https://...
    note: 원문을 읽었는지, 요약만 봤는지
---
```

- 검사는 `src/content.config.ts`의 스키마가 합니다. 학습 페이지는 `status`·`sources`·`learned`가 하나라도 없으면 빌드가 멈춥니다.
  `origin: worknote`(기본값)인 페이지는 `worknote_id`도 필수입니다. 화면 여백의 「쓴 곳」이 둘을 구분해 보여 줍니다.
- 홈·카테고리 개요처럼 원 노트가 없는 페이지만 `page: hub`로 면제합니다. `index.md`·`index.mdx`가 아닌 파일에 쓰면 `scripts/check-hubs.mjs`가 빌드를 멈춥니다.
- `status`는 덜 된 글도 일찍 올리고, 읽는 사람에게 어디까지 믿어도 되는지 알려 주려고 둡니다.
  단계 이름(씨앗·정리됨 같은 것)을 쓰지 않고, 확인한 범위를 문장으로 적습니다. 예: "주요 출처는 확인했습니다. 저작권 절은 기사 해설까지만 읽었습니다."
  화면에서는 오른쪽 여백(좁은 화면에서는 본문 아래)의 「정리 상태」에 그대로 나옵니다.
- 한 페이지 안에서 일부 절만 확인이 덜 됐으면 그 절 위에 `<Aside type="note" title="확인 범위">`를 둡니다. 색 상자가 아니라 조용한 한 줄로 보입니다.
- 출처는 실제로 열어 본 자료만 씁니다. 요약만 봤으면 `note`에 그렇게 적습니다.

### 시각화 부품 (`src/components/`)

```mdx
import CompareTable from '../../../../components/CompareTable.astro';
import StepFlow from '../../../../components/StepFlow.astro';
import SummaryCard from '../../../../components/SummaryCard.astro';

<SummaryCard title="결론 한 문장" points={['근거 1', '근거 2']} />

<CompareTable
  caption="표 제목"
  columns={['항목', 'A', 'B']}
  highlight={2}
  rows={[['구조', 'A의 값', 'B의 값']]}
/>

<StepFlow
  caption="'사람 판단'이 붙은 단계는 사람이 맡는 자리"
  steps={[{ title: '단계', owner: '담당', detail: '설명', human: true }]}
/>
```

- 요약 카드는 페이지 맨 위에 하나만 둡니다.
- 비교표의 첫 열은 행 이름입니다. `highlight`는 강조할 열 번호(0부터)입니다.
- 흐름도에서 `human: true`인 단계는 담당 칸에 "사람 판단"이 붙고 강조색으로 표시됩니다. 사람이 판단하고 책임지는 자리에만 씁니다.
- 그림(캡처)은 `src/assets/<카테고리>/`에 webp로 두고 `<figure class="wiki-shot">`로 넣습니다. 예시는 `wiki/design/ui-design-references.mdx`.

### 디자인 기준 (A안 「연구 노트」, 2026-11-11 채택)

정한 과정과 시안 세 가지는 위키의 [UI·디자인 레퍼런스](src/content/docs/wiki/design/ui-design-references.mdx) 페이지에 있습니다. 화면을 고칠 때는 아래를 지킵니다.

- 서체는 Pretendard 하나. 고정폭(IBM Plex Mono)은 날짜·단계 번호 같은 **숫자에만** 씁니다. 한글 라벨에 고정폭을 쓰면 글자 사이가 벌어져 보입니다.
- 색은 `src/styles/wiki.css` 맨 위 토큰만 씁니다. 따뜻한 무채색 + 이끼색 강조 하나. **파란색·파란 음영은 쓰지 않습니다.**
- 칠한 상자, 둥근 카드, **카드 왼쪽 굵은 세로선**을 만들지 않습니다. 구분은 가는 가로선과 여백으로 합니다.
- 출처·정리 상태는 본문이 아니라 오른쪽 여백에 둡니다(`PageSidebar`·`Provenance` 부품). 좁은 화면에서는 `PageMeta`(Starlight `MarkdownContent` 대체)가 본문 아래에 같은 내용을 붙이고, 리드 문장도 이 부품이 그립니다.
- 한글 줄바꿈은 `word-break: keep-all`. 제목·리드의 가운뎃점은 `joinDots`로 앞에서 줄이 바뀌지 않게 합니다.
- 고친 뒤에는 데스크톱·좁은 화면(500px)·다크를 렌더해서 직접 봅니다. 빌드 통과는 디자인 확인이 아닙니다.

### 문체

- 본문은 합니다체 서술, 소제목은 명사구로 씁니다. 결론은 `description`(리드 문장)과 요약 카드에 둡니다.
- em·en 대시(— –)는 쓰지 않습니다. 하이픈이나 마침표로 씁니다.
- 형기님이 준 문장은 고치지 않습니다. 손대야 하면 "원문 / 수정안 / 사유"로 먼저 보여 줍니다.
- 글쓰기 지침 정본은 공유 드라이브 `지침(.md)` 폴더입니다(`writing-guide` 스킬). 이 저장소에 복제하지 않습니다.

## 4. 글이 들어오는 두 길

| 길 | 언제 | 머리말 |
|---|---|---|
| **WorkNote에서 발행** | 공부하면서 WorkNote에 적어 둔 것을 정리할 때 | `origin: worknote` + `worknote_id` |
| **위키에서 직접 작성** | 캡처·이미지·표·도식이 많아 처음부터 위키에서 짜는 편이 나을 때 | `origin: wiki` (`worknote_id` 없음) |

어느 길이든 `status`·`sources`·`learned`는 필수입니다. 근거를 적는 위키라는 성격은 같습니다.

### 4-1. 직접 작성 절차

1. 형기님이 쓰고 싶은 내용과 캡처를 주면 Claude가 카테고리 폴더에 `origin: wiki` 페이지를 짭니다.
   이미지는 `src/assets/<카테고리>/`에 webp로 넣습니다(예시: `wiki/design/ui-design-references.mdx`).
2. 브랜치 → PR을 열고 Netlify 배포 미리보기에서 봅니다. 간단한 문장 수정은 GitHub 웹에서 파일을 직접 고쳐도 같은 미리보기가 뜹니다.
3. 병합하면 배포됩니다. WorkNote에는 아무것도 쓰지 않습니다.
4. 웹 편집기는 **Pages CMS**(app.pagescms.org)를 `try/pages-cms` 브랜치에서 시험 중입니다(2026-11-12).
   설정은 저장소 맨 위 `.pages.yml` 하나이고 빌드 결과(`dist/`)에 들어가지 않아 이식성 규칙과 부딪히지 않습니다.
   Decap CMS류는 Netlify Identity에 기대므로 쓰지 않습니다.
   - 「글 쓰기 (서식 편집)」: 새 `.md` 글. 이미지는 `public/wiki/media/`에 올라가고 본문에 `/wiki/media/…`로 들어갑니다.
   - 「원문 편집」: 기존 `.mdx` 글. 표·흐름도 부품을 서식 편집기가 지킬 수 없어 원문 그대로 고칩니다.
   - 저장할 때마다 그 브랜치에 커밋이 바로 생깁니다. `main`에서 저장하면 바로 배포되므로, 브랜치에서 쓰고 PR로 병합합니다.
   - 머리말 검사(`content.config.ts`)는 빌드에서 그대로 돕니다. 빠진 항목이 있으면 미리보기 빌드가 실패합니다.

### 4-2. WorkNote 발행 절차 (단방향)

WorkNote가 원본이고 위키는 발행본입니다. 위키에서 고친 내용은 WorkNote로 되돌려 쓰지 않습니다.

1. **후보 표시**: 학습 노트에는 태그 `학습`을 답니다. 발행할 노트는 제목 앞에 `[위키]`를 붙입니다.
   후보 찾기는 WorkNote `search_notes`로 `query: "[위키]"`, 또는 `tags: ["학습"]`.
2. **원 노트 확인**: 노트 UUID를 `worknote_id`에 넣습니다.
3. **페이지 작성**: 위 페이지 틀대로 카테고리 폴더에 만듭니다. 원 노트를 그대로 옮기지 않고, 시각화 부품을 써서 다시 짭니다.
4. **검사**: `npm run build`가 통과해야 합니다. 출력 전에 글쓰기 린터를 돌립니다.
   `node "G:\내 드라이브\1. Project\도구\글쓰기린터\글쓰기린터.mjs" <파일> --유형=기록`
5. **PR**: `main`에 바로 푸시하지 않고 브랜치 → PR을 엽니다. Netlify 배포 미리보기 주소에서 확인합니다.
6. **병합**: `main`에 병합하면 자동 배포됩니다.
7. **원 노트에 주소 덧붙이기**: 원 노트 끝 `## 위키` 절에 배포 주소 한 줄만 덧붙입니다(`append_note`).
   원 노트 본문은 고치지 않습니다. 제목의 `[위키]`도 그대로 둡니다(발행 여부는 주소 줄로 판단).

자동화는 첫 페이지를 발행해 본 뒤에 이 절차를 기준으로 만듭니다.

## 5. 명령

| 명령 | 동작 |
|---|---|
| `npm run dev` | 로컬 미리보기 (`localhost:4321`) |
| `npm run build` | 스키마 검사 + `dist/` 생성 |
| `npm run preview` | 빌드 결과를 로컬에서 확인 |
