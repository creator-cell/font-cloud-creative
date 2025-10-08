import { requireServerRole } from "@/lib/roles";
import { fetchAnnouncements } from "@/lib/api/admin";
import { AnnouncementForm } from "@/components/admin/announcement-form";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default async function AdminAnnouncementsPage() {
  const session = await requireServerRole(["owner", "admin", "support"]);
  if (!session.apiToken) {
    throw new Error("Missing admin token");
  }

  const { announcements } = await fetchAnnouncements(session.apiToken);

  return (
    <div className="grid gap-6 lg:grid-cols-[380px_1fr]">
      <Card>
        <CardHeader>
          <CardTitle>New announcement</CardTitle>
        </CardHeader>
        <CardContent>
          <AnnouncementForm token={session.apiToken} />
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Recent</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {announcements.map((announcement: any) => (
            <div key={announcement._id} className="rounded-lg border border-slate-200 bg-white p-4 transition-colors dark:border-slate-800 dark:bg-slate-900">
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-semibold text-slate-900 dark:text-white">{announcement.title}</h3>
                <span className="text-xs text-slate-500 dark:text-slate-400">{announcement.audience}</span>
              </div>
              <p className="mt-2 whitespace-pre-wrap text-sm text-slate-600 dark:text-slate-300">{announcement.body}</p>
              {announcement.link && (
                <a href={announcement.link} className="mt-2 inline-block text-xs text-brand">
                  {announcement.link}
                </a>
              )}
              <p className="mt-2 text-[10px] uppercase tracking-wide text-slate-500 dark:text-slate-400">
                {announcement.published ? "Published" : "Draft"} • {new Date(announcement.createdAt).toLocaleString()}
              </p>
            </div>
          ))}
          {announcements.length === 0 && <p className="text-sm text-slate-500 dark:text-slate-400">No announcements yet.</p>}
        </CardContent>
      </Card>
    </div>
  );
}
