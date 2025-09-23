export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className={"flex justify-center min-h-screen px-4 sm:px-8"}>
      <div className="w-full max-w-[1240px]">{children}</div>
    </div>
  );
}
