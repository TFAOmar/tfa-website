import { useState } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import AdminTopBar from "@/components/admin/AdminTopBar";
import { ArrowLeft, Plus, Pencil, Trash2, Loader2, Upload } from "lucide-react";
import { toast } from "sonner";
import { SEOHead } from "@/components/seo";
import { partnerCategories } from "@/components/preferred-partners/partnerCategories";
import {
  usePreferredPartners,
  useSavePartner,
  useDeletePartner,
  useUploadPartnerPhoto,
  partnerPhoto,
  slugify,
  type PreferredPartner,
} from "@/hooks/usePreferredPartners";

const emptyForm = {
  id: "",
  slug: "",
  name: "",
  company: "",
  category: partnerCategories[0].id,
  title: "",
  city: "",
  state: "",
  bio: "",
  specialties: "",
  phone: "",
  email: "",
  website_url: "",
  photo_url: "",
  display_order: 0,
  is_published: true,
};

type FormState = typeof emptyForm;

const AdminPreferredPartners = () => {
  const { data: partners = [], isLoading } = usePreferredPartners({ includeUnpublished: true });
  const savePartner = useSavePartner();
  const deletePartner = useDeletePartner();
  const uploadPhoto = useUploadPartnerPhoto();

  const [open, setOpen] = useState(false);
  const [form, setForm] = useState<FormState>(emptyForm);

  const set = <K extends keyof FormState>(key: K, value: FormState[K]) =>
    setForm((f) => ({ ...f, [key]: value }));

  const openNew = () => {
    setForm({ ...emptyForm, display_order: partners.length + 1 });
    setOpen(true);
  };

  const openEdit = (p: PreferredPartner) => {
    setForm({
      id: p.id,
      slug: p.slug,
      name: p.name,
      company: p.company ?? "",
      category: p.category,
      title: p.title ?? "",
      city: p.city ?? "",
      state: p.state ?? "",
      bio: p.bio ?? "",
      specialties: p.specialties.join(", "),
      phone: p.phone ?? "",
      email: p.email ?? "",
      website_url: p.website_url ?? "",
      photo_url: p.photo_url ?? "",
      display_order: p.display_order,
      is_published: p.is_published,
    });
    setOpen(true);
  };

  const handlePhoto = async (file: File | null) => {
    if (!file) return;
    if (!file.type.startsWith("image/")) {
      toast.error("Please choose an image file");
      return;
    }
    try {
      const url = await uploadPhoto.mutateAsync(file);
      set("photo_url", url);
      toast.success("Photo uploaded");
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "Upload failed");
    }
  };

  const handleSave = async () => {
    if (!form.name.trim()) {
      toast.error("Name is required");
      return;
    }
    try {
      await savePartner.mutateAsync({
        id: form.id || undefined,
        slug: form.slug || slugify(form.name),
        name: form.name.trim(),
        company: form.company,
        category: form.category,
        title: form.title,
        city: form.city,
        state: form.state,
        bio: form.bio,
        specialties: form.specialties
          .split(",")
          .map((s) => s.trim())
          .filter(Boolean),
        phone: form.phone,
        email: form.email,
        website_url: form.website_url,
        photo_url: form.photo_url,
        display_order: Number(form.display_order) || 0,
        is_published: form.is_published,
      });
      toast.success(form.id ? "Partner updated" : "Partner added");
      setOpen(false);
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "Could not save partner");
    }
  };

  const handleDelete = async (id: string) => {
    try {
      await deletePartner.mutateAsync(id);
      toast.success("Partner removed");
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "Could not remove partner");
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <SEOHead title="Manage Preferred Partners" description="Admin management of preferred partner profiles." noindex />
      <AdminTopBar />

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="flex flex-wrap items-center justify-between gap-4 mb-8">
          <div>
            <Link
              to="/admin"
              className="inline-flex items-center text-sm text-muted-foreground hover:text-foreground mb-2"
            >
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Admin
            </Link>
            <h1 className="text-3xl font-bold text-foreground">Preferred Partners</h1>
            <p className="text-muted-foreground">
              Profiles shown on the public Preferred Partners page.
            </p>
          </div>
          <Button onClick={openNew}>
            <Plus className="mr-2 h-4 w-4" />
            Add Partner
          </Button>
        </div>

        {isLoading ? (
          <div className="flex justify-center py-20">
            <Loader2 className="h-6 w-6 animate-spin text-accent" />
          </div>
        ) : (
          <div className="rounded-xl border border-border overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Partner</TableHead>
                  <TableHead>Category</TableHead>
                  <TableHead>Contact</TableHead>
                  <TableHead>Order</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {partners.map((p) => {
                  const photo = partnerPhoto(p);
                  return (
                    <TableRow key={p.id}>
                      <TableCell>
                        <div className="flex items-center gap-3">
                          {photo && (
                            <img
                              src={photo}
                              alt={p.name}
                              className="h-10 w-10 rounded-full object-cover object-top"
                            />
                          )}
                          <div>
                            <div className="font-medium text-foreground">{p.name}</div>
                            <div className="text-xs text-muted-foreground">
                              {[p.title, p.company].filter(Boolean).join(" • ")}
                            </div>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell className="text-sm">
                        {partnerCategories.find((c) => c.id === p.category)?.short ?? p.category}
                      </TableCell>
                      <TableCell className="text-xs text-muted-foreground">
                        <div>{p.email || "—"}</div>
                        <div>{p.phone || "—"}</div>
                      </TableCell>
                      <TableCell>{p.display_order}</TableCell>
                      <TableCell>
                        <Badge variant={p.is_published ? "default" : "secondary"}>
                          {p.is_published ? "Published" : "Hidden"}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-right whitespace-nowrap">
                        <Button variant="ghost" size="icon" onClick={() => openEdit(p)}>
                          <Pencil className="h-4 w-4" />
                        </Button>
                        <AlertDialog>
                          <AlertDialogTrigger asChild>
                            <Button variant="ghost" size="icon">
                              <Trash2 className="h-4 w-4 text-destructive" />
                            </Button>
                          </AlertDialogTrigger>
                          <AlertDialogContent>
                            <AlertDialogHeader>
                              <AlertDialogTitle>Remove {p.name}?</AlertDialogTitle>
                              <AlertDialogDescription>
                                This permanently removes the profile from the website.
                              </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                              <AlertDialogCancel>Cancel</AlertDialogCancel>
                              <AlertDialogAction onClick={() => handleDelete(p.id)}>
                                Remove
                              </AlertDialogAction>
                            </AlertDialogFooter>
                          </AlertDialogContent>
                        </AlertDialog>
                      </TableCell>
                    </TableRow>
                  );
                })}
                {partners.length === 0 && (
                  <TableRow>
                    <TableCell colSpan={6} className="text-center text-muted-foreground py-10">
                      No partners yet.
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
        )}
      </div>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="max-w-2xl max-h-[85vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>{form.id ? "Edit Partner" : "Add Partner"}</DialogTitle>
          </DialogHeader>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <Label>Name *</Label>
              <Input value={form.name} onChange={(e) => set("name", e.target.value)} />
            </div>
            <div>
              <Label>Company</Label>
              <Input value={form.company} onChange={(e) => set("company", e.target.value)} />
            </div>
            <div>
              <Label>Title / Role</Label>
              <Input value={form.title} onChange={(e) => set("title", e.target.value)} />
            </div>
            <div>
              <Label>Category</Label>
              <Select value={form.category} onValueChange={(v) => set("category", v)}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {partnerCategories.map((c) => (
                    <SelectItem key={c.id} value={c.id}>
                      {c.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label>City</Label>
              <Input value={form.city} onChange={(e) => set("city", e.target.value)} />
            </div>
            <div>
              <Label>State</Label>
              <Input value={form.state} onChange={(e) => set("state", e.target.value)} />
            </div>
            <div>
              <Label>Phone</Label>
              <Input value={form.phone} onChange={(e) => set("phone", e.target.value)} />
            </div>
            <div>
              <Label>Email</Label>
              <Input value={form.email} onChange={(e) => set("email", e.target.value)} />
            </div>
            <div className="sm:col-span-2">
              <Label>Website</Label>
              <Input
                placeholder="https://example.com"
                value={form.website_url}
                onChange={(e) => set("website_url", e.target.value)}
              />
            </div>
            <div className="sm:col-span-2">
              <Label>Bio</Label>
              <Textarea rows={5} value={form.bio} onChange={(e) => set("bio", e.target.value)} />
            </div>
            <div className="sm:col-span-2">
              <Label>Areas of focus (comma separated)</Label>
              <Input
                value={form.specialties}
                onChange={(e) => set("specialties", e.target.value)}
                placeholder="Mortgage Financing, Real Estate"
              />
            </div>
            <div className="sm:col-span-2">
              <Label>Photo</Label>
              <div className="flex items-center gap-3 mt-1">
                {form.photo_url && (
                  <img
                    src={form.photo_url}
                    alt="Partner"
                    className="h-14 w-14 rounded-lg object-cover object-top"
                  />
                )}
                <Input
                  type="file"
                  accept="image/*"
                  onChange={(e) => handlePhoto(e.target.files?.[0] ?? null)}
                />
                {uploadPhoto.isPending && <Loader2 className="h-4 w-4 animate-spin" />}
              </div>
              <p className="text-xs text-muted-foreground mt-1">
                <Upload className="inline h-3 w-3 mr-1" />
                Leave empty to use the advisor directory photo when the profile matches an advisor.
              </p>
            </div>
            <div>
              <Label>Display order</Label>
              <Input
                type="number"
                value={form.display_order}
                onChange={(e) => set("display_order", Number(e.target.value))}
              />
            </div>
            <div className="flex items-center gap-3 pt-6">
              <Switch
                checked={form.is_published}
                onCheckedChange={(v) => set("is_published", v)}
              />
              <Label>Published</Label>
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleSave} disabled={savePartner.isPending}>
              {savePartner.isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Save
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default AdminPreferredPartners;
