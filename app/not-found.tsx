import Link from "next/link";
import { Plane } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function NotFound() {
  return (
    <div className="bg-ambient grid min-h-dvh place-items-center px-6 text-center">
      <div>
        <span className="mx-auto mb-6 grid size-16 place-items-center rounded-3xl bg-rose text-rose-deep">
          <Plane className="size-7 -rotate-12" aria-hidden="true" />
        </span>
        <h1 className="font-display text-4xl font-semibold text-plum">This page flew off course</h1>
        <p className="mx-auto mt-3 max-w-sm text-muted-strong">
          We couldn&apos;t find the page you were looking for. Let&apos;s get you back on the right route.
        </p>
        <div className="mt-7 flex flex-wrap justify-center gap-2.5">
          <Button asChild>
            <Link href="/dashboard">Go to dashboard</Link>
          </Button>
          <Button asChild variant="outline">
            <Link href="/">Back to welcome</Link>
          </Button>
        </div>
      </div>
    </div>
  );
}
