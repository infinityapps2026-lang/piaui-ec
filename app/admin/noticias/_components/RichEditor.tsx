'use client'

import { useEffect, useRef, useState } from 'react'
import { useEditor, EditorContent, type Editor } from '@tiptap/react'
import StarterKit from '@tiptap/starter-kit'
import Image from '@tiptap/extension-image'
import Link from '@tiptap/extension-link'
import Underline from '@tiptap/extension-underline'
import { createBrowserClient } from '@supabase/ssr'

type Props = {
  name: string
  defaultValue?: string | null
  placeholder?: string
}

export default function RichEditor({ name, defaultValue, placeholder }: Props) {
  const [html, setHtml] = useState<string>(defaultValue ?? '')
  const [uploading, setUploading] = useState(false)
  const [uploadError, setUploadError] = useState<string | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        heading: { levels: [2, 3] },
      }),
      Underline,
      Link.configure({
        openOnClick: false,
        autolink: true,
        HTMLAttributes: { rel: 'noopener noreferrer nofollow', target: '_blank' },
      }),
      Image,
    ],
    content: defaultValue ?? '',
    immediatelyRender: false,
    onUpdate: ({ editor }) => setHtml(editor.getHTML()),
  })

  useEffect(() => {
    if (editor && defaultValue && editor.isEmpty) {
      editor.commands.setContent(defaultValue)
    }
  }, [editor, defaultValue])

  async function handleImageUpload(file: File) {
    if (!editor) return
    setUploadError(null)
    setUploading(true)
    try {
      const supabase = createBrowserClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      )
      const ext = file.name.split('.').pop()
      const path = `conteudo/${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`
      const { error } = await supabase.storage.from('noticias').upload(path, file, { upsert: true })
      if (error) throw new Error(error.message)
      const { data: { publicUrl } } = supabase.storage.from('noticias').getPublicUrl(path)
      editor.chain().focus().setImage({ src: publicUrl, alt: file.name }).run()
    } catch (e) {
      setUploadError(e instanceof Error ? e.message : 'Erro ao enviar imagem')
    } finally {
      setUploading(false)
      if (fileInputRef.current) fileInputRef.current.value = ''
    }
  }

  function promptLink() {
    if (!editor) return
    const prev = editor.getAttributes('link').href as string | undefined
    const url = window.prompt('URL do link (deixe vazio para remover):', prev ?? 'https://')
    if (url === null) return
    if (url === '') {
      editor.chain().focus().extendMarkRange('link').unsetLink().run()
      return
    }
    editor.chain().focus().extendMarkRange('link').setLink({ href: url }).run()
  }

  return (
    <div className="rich-editor border border-slate-300 rounded-lg overflow-hidden bg-white">
      <Toolbar
        editor={editor}
        uploading={uploading}
        onPickImage={() => fileInputRef.current?.click()}
        onLink={promptLink}
      />

      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={(e) => {
          const f = e.target.files?.[0]
          if (f) handleImageUpload(f)
        }}
      />

      {editor && <EditorContent editor={editor} />}

      {!editor && (
        <div className="px-4 py-3 text-sm text-slate-400 min-h-[320px]">
          {placeholder ?? 'Carregando editor...'}
        </div>
      )}

      {uploadError && (
        <p className="px-4 py-2 text-xs text-red-600 border-t border-red-100 bg-red-50">
          {uploadError}
        </p>
      )}

      <input type="hidden" name={name} value={html} />
    </div>
  )
}

function Toolbar({
  editor,
  uploading,
  onPickImage,
  onLink,
}: {
  editor: Editor | null
  uploading: boolean
  onPickImage: () => void
  onLink: () => void
}) {
  if (!editor) {
    return <div className="h-12 border-b border-slate-200 bg-slate-50" />
  }

  const btn = (active: boolean) =>
    `px-2.5 py-1.5 text-sm rounded-md transition-colors ${
      active
        ? 'bg-[#0a1f4f] text-white'
        : 'text-slate-700 hover:bg-slate-200'
    }`

  return (
    <div className="flex flex-wrap items-center gap-1 border-b border-slate-200 bg-slate-50 px-2 py-2">
      <button
        type="button"
        onClick={() => editor.chain().focus().toggleBold().run()}
        className={btn(editor.isActive('bold'))}
        title="Negrito (Ctrl+B)"
      >
        <b>B</b>
      </button>
      <button
        type="button"
        onClick={() => editor.chain().focus().toggleItalic().run()}
        className={btn(editor.isActive('italic'))}
        title="Itálico (Ctrl+I)"
      >
        <i>I</i>
      </button>
      <button
        type="button"
        onClick={() => editor.chain().focus().toggleUnderline().run()}
        className={btn(editor.isActive('underline'))}
        title="Sublinhado (Ctrl+U)"
      >
        <u>U</u>
      </button>
      <button
        type="button"
        onClick={() => editor.chain().focus().toggleStrike().run()}
        className={btn(editor.isActive('strike'))}
        title="Tachado"
      >
        <s>S</s>
      </button>

      <span className="mx-1 h-6 w-px bg-slate-300" />

      <button
        type="button"
        onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
        className={btn(editor.isActive('heading', { level: 2 }))}
        title="Título"
      >
        H2
      </button>
      <button
        type="button"
        onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()}
        className={btn(editor.isActive('heading', { level: 3 }))}
        title="Subtítulo"
      >
        H3
      </button>

      <span className="mx-1 h-6 w-px bg-slate-300" />

      <button
        type="button"
        onClick={() => editor.chain().focus().toggleBulletList().run()}
        className={btn(editor.isActive('bulletList'))}
        title="Lista"
      >
        • Lista
      </button>
      <button
        type="button"
        onClick={() => editor.chain().focus().toggleOrderedList().run()}
        className={btn(editor.isActive('orderedList'))}
        title="Lista numerada"
      >
        1. Lista
      </button>
      <button
        type="button"
        onClick={() => editor.chain().focus().toggleBlockquote().run()}
        className={btn(editor.isActive('blockquote'))}
        title="Citação"
      >
        ❝
      </button>

      <span className="mx-1 h-6 w-px bg-slate-300" />

      <button
        type="button"
        onClick={onLink}
        className={btn(editor.isActive('link'))}
        title="Inserir/editar link"
      >
        🔗 Link
      </button>
      <button
        type="button"
        onClick={onPickImage}
        disabled={uploading}
        className={btn(false) + (uploading ? ' opacity-50 cursor-wait' : '')}
        title="Inserir imagem"
      >
        {uploading ? '⏳ Enviando...' : '🖼 Imagem'}
      </button>

      <span className="mx-1 h-6 w-px bg-slate-300" />

      <button
        type="button"
        onClick={() => editor.chain().focus().undo().run()}
        className={btn(false)}
        title="Desfazer (Ctrl+Z)"
      >
        ↶
      </button>
      <button
        type="button"
        onClick={() => editor.chain().focus().redo().run()}
        className={btn(false)}
        title="Refazer (Ctrl+Shift+Z)"
      >
        ↷
      </button>
    </div>
  )
}
