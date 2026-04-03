"use client";

import { useState, useEffect } from "react";
import { toast } from "sonner";
import { Loader2, Plus, Info, Zap } from "lucide-react";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Field,
  FieldLabel,
  FieldDescription,
  FieldGroup,
} from "@/components/ui/field";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

interface RuleBuilderFormProps {
  initialData?: any;
  onSuccess: () => void;
}

export function RuleBuilderForm({ initialData, onSuccess }: RuleBuilderFormProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [platforms, setPlatforms] = useState<any[]>([]);
  const [isLoadingPlatforms, setIsLoadingPlatforms] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Form State
  const [formData, setFormData] = useState({
    name: initialData?.name || "",
    platform: initialData?.platform || "",
    triggerType: initialData?.triggerType || "any_comment",
    keywords: Array.isArray(initialData?.keywords) ? initialData.keywords.join(", ") : "",
    useAI: !!initialData?.useAI,
    replyTemplate: initialData?.replyTemplate || "",
    aiPrompt: initialData?.aiPrompt || "",
    isActive: initialData?.isActive !== undefined ? initialData.isActive : true,
  });

  useEffect(() => {
    if (isOpen) {
      fetchPlatforms();
    }
  }, [isOpen]);

  const fetchPlatforms = async () => {
    setIsLoadingPlatforms(true);
    try {
      const res = await fetch("/api/social/accounts");
      if (res.ok) {
        const data = await res.json();
        setPlatforms(data);
      }
    } catch (error) {
      console.error("Error fetching platforms:", error);
    } finally {
      setIsLoadingPlatforms(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.platform) {
      toast.error("Please fill in the required fields.");
      return;
    }

    setIsSubmitting(true);
    try {
      const payload = {
        ...formData,
        keywords: formData.keywords ? formData.keywords.split(",").map((k: string) => k.trim()).filter((k: string) => k !== "") : [],
      };

      const url = initialData ? `/api/auto-reply/rules/${initialData.id}` : "/api/auto-reply/rules";
      const method = initialData ? "PATCH" : "POST";

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!res.ok) throw new Error("Failed to save rule");

      toast.success(initialData ? "Rule updated" : "Rule created");
      setIsOpen(false);
      onSuccess();
      if (!initialData) {
        setFormData({
          name: "",
          platform: "",
          triggerType: "any_comment",
          keywords: "",
          useAI: false,
          replyTemplate: "",
          aiPrompt: "",
          isActive: true,
        });
      }
    } catch (error) {
      toast.error("An error occurred. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger render={<Button className="bg-[#635bff] hover:bg-[#5851e0] text-white gap-2 font-semibold shadow-sm" />}>
        <Plus className="w-4 h-4" />
        {initialData ? "Edit Rule" : "Create Rule"}
      </DialogTrigger>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto border border-foreground/10 shadow-xl">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold text-[#1a1f36]">
            {initialData ? "Edit Auto-Reply Rule" : "Create New Auto-Reply Rule"}
          </DialogTitle>
          <DialogDescription className="text-[#697386]">
            Define when and how the AI should automatically respond to comments.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6 py-4">
          <FieldGroup>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Field>
                <FieldLabel className="text-sm font-semibold text-[#3c4257]">Rule Name</FieldLabel>
                <Input 
                  placeholder="e.g. Welcome Message" 
                  className="border-[#e3e8ef] focus:ring-[#635bff] focus:border-[#635bff]" 
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  required
                />
              </Field>

              <Field>
                <FieldLabel className="text-sm font-semibold text-[#3c4257]">Platform</FieldLabel>
                <Select 
                  value={formData.platform}
                  onValueChange={(val) => setFormData({ ...formData, platform: val })}
                >
                  <SelectTrigger className="border-[#e3e8ef]">
                    <SelectValue placeholder="Select platform" />
                  </SelectTrigger>
                  <SelectContent>
                    {isLoadingPlatforms ? (
                      <div className="flex items-center justify-center p-4">
                        <Loader2 className="w-4 h-4 animate-spin" />
                      </div>
                    ) : platforms.length === 0 ? (
                      <div className="p-2 text-sm text-center text-[#8792a2]">No accounts connected</div>
                    ) : (
                      platforms.map((account) => (
                        <SelectItem key={account.platform} value={account.platform}>
                          <div className="flex items-center gap-2">
                            <span className="capitalize">{account.platform}</span>
                            <span className="text-[10px] text-[#8792a2]">({account.username})</span>
                          </div>
                        </SelectItem>
                      ))
                    )}
                  </SelectContent>
                </Select>
              </Field>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Field>
                <FieldLabel className="text-sm font-semibold text-[#3c4257]">Trigger Type</FieldLabel>
                <Select 
                  value={formData.triggerType}
                  onValueChange={(val) => setFormData({ ...formData, triggerType: val })}
                >
                  <SelectTrigger className="border-[#e3e8ef]">
                    <SelectValue placeholder="Select trigger" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="any_comment">Any Comment</SelectItem>
                    <SelectItem value="keyword">Keyword Match</SelectItem>
                    <SelectItem value="first_comment">First Comment Only</SelectItem>
                  </SelectContent>
                </Select>
              </Field>

              <div className="flex flex-row items-center justify-between rounded-lg border border-[#e3e8ef] p-3 shadow-sm bg-[#f6f9fc]/50">
                <div className="space-y-0.5">
                  <p className="text-sm font-semibold text-[#3c4257]">Active</p>
                  <p className="text-[11px] text-[#697386]">Rule is currently running</p>
                </div>
                <Switch
                  checked={formData.isActive}
                  onCheckedChange={(checked) => setFormData({ ...formData, isActive: checked })}
                />
              </div>
            </div>

            {formData.triggerType === "keyword" && (
              <Field>
                <FieldLabel className="text-sm font-semibold text-[#3c4257]">Keywords</FieldLabel>
                <Input 
                  placeholder="pricing, help, support (comma separated)" 
                  className="border-[#e3e8ef]" 
                  value={formData.keywords}
                  onChange={(e) => setFormData({ ...formData, keywords: e.target.value })}
                />
                <FieldDescription className="text-xs">
                  The rule will trigger if any of these words are found in the comment.
                </FieldDescription>
              </Field>
            )}

            <div className="space-y-4 pt-2">
              <div className="flex items-center justify-between p-4 bg-gradient-to-r from-[#635bff]/5 to-[#7f78ff]/5 border border-[#635bff]/10 rounded-xl">
                <div className="space-y-1">
                  <h4 className="text-sm font-bold text-[#1a1f36] flex items-center gap-1.5">
                    Reply Mode
                    <Badge variant="outline" className="text-[9px] h-4 bg-white border-[#635bff]/20 text-[#635bff]">Gemini AI</Badge>
                  </h4>
                  <p className="text-xs text-[#697386]">Choose between a static template or AI generation.</p>
                </div>
                <Switch
                  checked={formData.useAI}
                  onCheckedChange={(checked) => setFormData({ ...formData, useAI: checked })}
                  className="data-[state=checked]:bg-[#635bff]"
                />
              </div>

              {!formData.useAI ? (
                <Field>
                  <FieldLabel className="text-sm font-semibold text-[#3c4257]">Reply Template</FieldLabel>
                  <Textarea 
                    placeholder="Thanks for your comment! We'll get back to you soon." 
                    className="min-h-[100px] border-[#e3e8ef] resize-none" 
                    value={formData.replyTemplate}
                    onChange={(e) => setFormData({ ...formData, replyTemplate: e.target.value })}
                  />
                  <FieldDescription className="text-[11px] flex items-center gap-1">
                    <Info className="w-3 h-3" />
                    Tip: You can use {"{{username}}"} and {"{{comment}}"} as variables.
                  </FieldDescription>
                </Field>
              ) : (
                <Field>
                  <FieldLabel className="text-sm font-semibold text-[#3c4257]">AI Persona / Prompt</FieldLabel>
                  <Textarea 
                    placeholder="Reply as a friendly brand ambassador. Keep it under 100 words and offer help." 
                    className="min-h-[100px] resize-none border-foreground/10 bg-muted/50" 
                    value={formData.aiPrompt}
                    onChange={(e) => setFormData({ ...formData, aiPrompt: e.target.value })}
                  />
                  <FieldDescription className="text-xs">
                    Instructions for Gemini on how to draft the response.
                  </FieldDescription>
                </Field>
              )}
            </div>
          </FieldGroup>

          <DialogFooter className="pt-4 border-t border-[#f0f3f7]">
            <Button 
              type="button" 
              variant="outline" 
              onClick={() => setIsOpen(false)}
              className="border-[#e3e8ef] text-[#697386]"
            >
              Cancel
            </Button>
            <Button 
              type="submit" 
              disabled={isSubmitting}
              className="bg-[#635bff] hover:bg-[#5851e0] text-white min-w-[100px] font-semibold"
            >
              {isSubmitting ? <Loader2 className="w-4 h-4 animate-spin" /> : initialData ? "Save Changes" : "Create Rule"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
