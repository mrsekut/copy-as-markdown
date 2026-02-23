export function showToast(msg: string): void {
  const el = document.createElement('div');
  el.textContent = msg;
  Object.assign(el.style, {
    position: 'fixed',
    bottom: '20px',
    right: '20px',
    background: 'rgba(0, 0, 0, 0.75)',
    color: 'rgba(255, 255, 255, 0.9)',
    padding: '8px 16px',
    borderRadius: '8px',
    fontSize: '14px',
    zIndex: '99999',
    transition: 'opacity 0.3s',
  });
  document.body.appendChild(el);
  setTimeout(() => {
    el.style.opacity = '0';
    setTimeout(() => el.remove(), 300);
  }, 1500);
}
