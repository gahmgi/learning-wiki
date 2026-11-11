# 학습 위키 - 작업 지침

배운 것을 그림과 표로 쌓아 두는 개인 위키입니다. Astro Starlight로 만들고, `dist/`만 정적 호스팅에 배포합니다.
첫 주제는 게임 개발과 AI 아트 파이프라인입니다.

## 1. 계정 (가장 먼저 확인)

- 개인 저장소입니다. 원격은 `github.com/gahmgi/learning-wiki`(비공개)입니다.
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
| 파이프라인 | `src/content/docs/pipeline/` |
| 도구 | `src/content/docs/tools/` |
| 법·정책 | `src/content/docs/law-policy/` |
| 조직·직무 | `src/content/docs/org-roles/` |

파일 이름은 영문 소문자와 하이픈으로 짓습니다(주소가 됩니다). 제목은 머리말 `title`에 한국어로 씁니다.

### 머리말 (필수 4칸, 빠지면 빌드 실패)

```yaml
---
title: 페이지 제목
description: 제목 아래 리드 문장. 이 페이지의 결론 한두 문장.
worknote_id: <WorkNote 원 노트 UUID>
maturity: 씨앗 | 자라는 중 | 정리됨
learned: 2026-11-11
sources:
  - title: 자료 이름 (발행일)
    url: https://...
    note: 원문을 읽었는지, 요약만 봤는지
---
```

- 검사는 `src/content.config.ts`의 스키마가 합니다. 학습 페이지는 위 4칸(`worknote_id`·`maturity`·`sources`·`learned`)이 하나라도 없으면 빌드가 멈춥니다.
- 홈·카테고리 개요처럼 원 노트가 없는 페이지만 `page: hub`로 면제합니다. 학습 페이지에는 쓰지 않습니다.
- 성숙도 기준
  - **씨앗**: 요약·기사만 봤거나 논점만 적어 둔 상태
  - **자라는 중**: 주요 출처를 확인했고 구조가 잡힌 상태
  - **정리됨**: 원문까지 확인했고 다시 고칠 일이 거의 없는 상태
- 한 페이지 안에서 일부 절만 확인이 덜 됐으면 그 절 위에 `<Aside type="caution" title="성숙도: 씨앗">`를 둡니다.
- 출처는 실제로 열어 본 자료만 씁니다. 요약만 봤으면 `note`에 그렇게 적습니다.

### 시각화 부품 (`src/components/`)

```mdx
import CompareTable from '../../../components/CompareTable.astro';
import StepFlow from '../../../components/StepFlow.astro';
import SummaryCard from '../../../components/SummaryCard.astro';

<SummaryCard title="결론 한 문장" points={['근거 1', '근거 2']} />

<CompareTable
  caption="표 제목"
  columns={['항목', 'A', 'B']}
  highlight={2}
  rows={[['구조', 'A의 값', 'B의 값']]}
/>

<StepFlow
  caption="주황색 단계는 사람이 맡는 자리"
  steps={[{ title: '단계', owner: '담당', detail: '설명', human: true }]}
/>
```

- 요약 카드는 페이지 맨 위에 하나만 둡니다.
- 비교표의 첫 열은 행 이름입니다. `highlight`는 강조할 열 번호(0부터)입니다.
- 흐름도에서 `human: true`인 단계는 주황색으로 표시됩니다. 사람이 판단하고 책임지는 자리에만 씁니다.

### 문체

- 본문은 합니다체 서술, 소제목은 명사구로 씁니다. 결론은 `description`(리드 문장)과 요약 카드에 둡니다.
- em·en 대시(— –)는 쓰지 않습니다. 하이픈이나 마침표로 씁니다.
- 형기님이 준 문장은 고치지 않습니다. 손대야 하면 "원문 / 수정안 / 사유"로 먼저 보여 줍니다.
- 글쓰기 지침 정본은 공유 드라이브 `지침(.md)` 폴더입니다(`writing-guide` 스킬). 이 저장소에 복제하지 않습니다.

## 4. 발행 절차 (WorkNote → 위키, 단방향)

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
