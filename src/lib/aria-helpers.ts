export const aria = {
  button: (label: string) => ({ role: 'button', 'aria-label': label }),
  link: (label: string) => ({ role: 'link', 'aria-label': label }),
  dialog: (label: string) => ({ role: 'dialog', 'aria-label': label })
};
