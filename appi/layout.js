// app/layout.js
export const metadata = {
  title: 'PetConnect Adoption Platform',
  description: 'Adopt a lovely pet today!',
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
