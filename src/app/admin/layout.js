export const metadata = {
  title: {
    default: "OnlyHotel CMS",
    template: "%s | OnlyHotel CMS",
  },
  robots: {
    index: false,
    follow: false,
  },
};

export default function AdminRootLayout({ children }) {
  return <>{children}</>;
}
