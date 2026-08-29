type ToastType = 'success' | 'error';

export const toast = ({ title, description, variant = 'success' }: { title: string; description: string; variant?: ToastType }) => {
  const toastContainer = document.getElementById('toast-container') || createToastContainer();
  const toast = document.createElement('div');
  toast.className = `fixed bottom-4 right-4 p-4 rounded-md shadow-lg ${
    variant === 'success' ? 'bg-green-500' : 'bg-red-500'
  } text-white max-w-xs animate-fade-in`;
  toast.innerHTML = `
    <h3 class="font-semibold">${title}</h3>
    <p class="text-sm">${description}</p>
  `;
  toastContainer.appendChild(toast);

  setTimeout(() => {
    toast.remove();
    if (toastContainer.childNodes.length === 0) {
      toastContainer.remove();
    }
  }, 3000);
};

const createToastContainer = () => {
  const container = document.createElement('div');
  container.id = 'toast-container';
  container.className = 'fixed bottom-4 right-4 z-50 space-y-2';
  document.body.appendChild(container);
  return container;
};