export { AuthProvider } from "./AuthProvider";
export { AuthModal } from "./AuthModal";
export { useAuth } from "./useAuth";

// CSS for react-modal animations
export const modalStyles = `
.ReactModal__Overlay {
  opacity: 0;
  transition: opacity 200ms ease-in-out;
}

.ReactModal__Overlay--after-open {
  opacity: 1;
}

.ReactModal__Overlay--before-close {
  opacity: 0;
}
`;