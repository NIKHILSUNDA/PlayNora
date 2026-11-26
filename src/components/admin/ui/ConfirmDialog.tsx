"use client";
import { useEffect, useState } from "react";
import { Loader2 } from "lucide-react";
import Modal from "./Modal";
import Field from "./Field";

interface Props {
  open: boolean; title: string; message: string; confirmLabel: string; danger?: boolean;
  /** When set, the dialog collects a reason and passes it to onConfirm. */
  reason?: { label: string; required?: boolean };
  onConfirm: (reason: string) => Promise<void> | void; onClose: () => void;
}
export default function ConfirmDialog({ open, title, message, confirmLabel, danger, reason, onConfirm, onClose }: Props) {
  const [text, setText] = useState(""), [busy, setBusy] = useState(false), [err, setErr] = useState("");
  useEffect(() => { if (open) { setText(""); setErr(""); setBusy(false); } }, [open]);
  const go = async () => {
    if (reason?.required && !text.trim()) return setErr("A reason is required");
    setBusy(true);
    try { await onConfirm(text.trim()); } finally { setBusy(false); }
  };
  return (
    <Modal open={open} title={title} onClose={busy ? () => undefined : onClose} size="sm" footer={<>
      <button className="adm-btn" onClick={onClose} disabled={busy}>Keep as is</button>
      <button className={danger ? "adm-btn-danger" : "adm-btn-primary"} onClick={go} disabled={busy}>{busy && <Loader2 size={14} className="animate-spin" aria-hidden="true" />}{confirmLabel}</button>
    </>}>
      <p className="text-sm leading-relaxed text-white/75">{message}</p>
      {reason && <div className="mt-4"><Field label={reason.label} error={err}><textarea rows={3} value={text} onChange={(e) => { setText(e.target.value); setErr(""); }} className="adm-input" /></Field></div>}
    </Modal>
  );
}
