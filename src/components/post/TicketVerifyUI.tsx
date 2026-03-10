// 상황: 현재 프로젝트 구조는 다음과 같다. (경로명 기준)
// post
//  ├ PostBaseLayout   ← state 관리
//  ├ general
//  │   ├ verify      ← container
//  │   └ new
//  └ season-pass
//      ├ verify
//      └ new
// season-pass
//  └ verify

// 지금 `TicketVerifyStep`에다가 티켓 인증 로직을 구현해 뒀음.
// 이 로직을 공통 컴포넌트로 사용하려고 했으나...
// general은 context로 / season-ticket은 props로 처리해야 하는 문제가 발생.
// 그래서 TicketVerifyUI를 하나 더 둬서 "Props"로만 받는 방식으로 처리해 보려고 함

interface Props {
  onImageChange: (image: string) => void;
  onNext: () => void;
}

export default function TicketVerifyUI({ onImageChange, onNext }: Props) {
  //  이미지 업로드 시 로직
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || e.target.files.length === 0) return; // 선택된 값이 없는 경우 Return
    onImageChange(e.target.files[0].name);
    console.log(e.target.files[0].name);
  };

  return (
    <div>
      {/* TODO: 이미지 업로드 프리뷰 */}
      <input
        type="file"
        accept="image/jpg, image/jpeg, image/png"
        name="ticket_image"
        onChange={handleChange}
      />
      <button onClick={onNext}>Next</button>
    </div>
  );
}
