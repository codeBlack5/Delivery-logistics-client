import { useNavigate } from "react-router-dom";

export default function BackButton({ fallback = "/dashboard" }) {
  const navigate = useNavigate();

  const handleBack = () => {
    if (window.history.length > 1) {
      navigate(-1);
    } else {
      navigate(fallback);
    }
  };

  return (
    <button
      type="button"
      onClick={handleBack}
      className="mb-4 inline-flex items-center gap-2 text-sm font-semibold text-[#0F3D5E] transition hover:text-[#F59E0B]"
    >
      <span aria-hidden="true">←</span>
      Back
    </button>
  );
}
