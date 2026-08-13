"use client";

import { useState } from "react";
import { Loader2 } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "@/hooks/use-toast";

export function ContactDialog({ children }: { children: React.ReactNode }) {
  const [open, setOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    if (isSubmitting) return;
    setIsSubmitting(true);
    // Demo only — no backend wired up, this just fakes success.
    setTimeout(() => {
      setIsSubmitting(false);
      setOpen(false);
      toast({
        variant: "success",
        title: "Success",
        description: "Your message has been sent. The AgroSight team will reach out soon.",
      });
    }, 1000);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="text-2xl font-semibold">Contact us</DialogTitle>
          <DialogDescription className="text-sm text-muted-foreground">
            Tell us about your farm and we&apos;ll get back to you within a day.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-5">
          <div className="space-y-1.5">
            <Label htmlFor="contactName">Full name</Label>
            <Input
              id="contactName"
              type="text"
              placeholder="Jane Farmer"
              className="h-11 text-base"
              required
            />
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="contactEmail">Email address</Label>
            <Input
              id="contactEmail"
              type="email"
              placeholder="farmer@agrosight.com"
              className="h-11 text-base"
              required
            />
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="contactMessage">Message</Label>
            <Textarea
              id="contactMessage"
              placeholder="Tell us a bit about your fields and what you're looking for..."
              className="min-h-28 text-base"
              required
            />
          </div>

          <Button type="submit" className="h-11 w-full text-base" disabled={isSubmitting}>
            {isSubmitting ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                Sending...
              </>
            ) : (
              "Send message"
            )}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}
