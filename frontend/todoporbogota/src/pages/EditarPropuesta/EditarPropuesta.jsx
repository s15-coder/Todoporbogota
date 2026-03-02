/**
 * Página: Editar una propuesta ya postulada.
 * Carga la propuesta por id (desde location.state), formulario con mismos campos que postular.
 */
import { useState, useEffect } from 'react'
import { Link, useNavigate, useLocation } from 'react-router-dom'
import SectionHeader from '../../components/SectionHeader/SectionHeader'
import { CATEGORIAS_INICIATIVA } from '../../data/categoriasIniciativa'
import { validarFormularioIniciativa } from '../../utils/validacionIniciativa'
import { getMisPropuestasStorage, updatePropuestaStorage } from '../../utils/storageMisPropuestas'
import '../PostularIniciativa/PostularIniciativa.css'
import './EditarPropuesta.css'

export default function EditarPropuesta() {
  const { state } = useLocation()
  const navigate = useNavigate()
  const id = state?.id
  const [propuesta, setPropuesta] = useState(null)
  const [form, setForm] = useState(null)
  const [errores, setErrores] = useState({})
  const [touched, setTouched] = useState({})
  const [guardado, setGuardado] = useState(false)

  useEffect(() => {
    if (!id) {
      navigate('/iniciativas/mis-propuestas', { replace: true })
      return
    }
    const list = getMisPropuestasStorage()
    const p = list.find((item) => item.id === id)
    if (!p) {
      navigate('/iniciativas/mis-propuestas', { replace: true })
      return
    }
    setPropuesta(p)
    const cat = CATEGORIAS_INICIATIVA.find((c) => c.value === p.categoria)
    setForm({
      titulo: p.titulo || '',
      descripcion: p.descripcion || '',
      categoria: cat ? String(cat.id) : '',
      barrio: p.barrio || '',
      participantes: p.participantes != null ? String(p.participantes) : '',
      imagen: p.imagen || null,
    })
  }, [id, navigate])

  const handleChange = (e) => {
    const { name, value } = e.target
    setForm((prev) => (prev ? { ...prev, [name]: value } : null))
    if (errores[name]) setErrores((prev) => ({ ...prev, [name]: null }))
  }

  const handleBlur = (e) => {
    setTouched((prev) => ({ ...prev, [e.target.name]: true }))
  }

  const handleImageChange = (e) => {
    const file = e.target.files?.[0]
    if (!file) {
      setForm((prev) => (prev ? { ...prev, imagen: propuesta?.imagen ?? null } : null))
      if (errores.imagen) setErrores((prev) => ({ ...prev, imagen: null }))
      return
    }
    if (!file.type.startsWith('image/')) {
      setErrores((prev) => ({ ...prev, imagen: 'El archivo debe ser una imagen (JPG, PNG o WebP).' }))
      return
    }
    if (file.size > 2 * 1024 * 1024) {
      setErrores((prev) => ({ ...prev, imagen: 'La imagen no puede superar 2 MB.' }))
      return
    }
    const reader = new FileReader()
    reader.onload = () => {
      setForm((prev) => (prev ? { ...prev, imagen: reader.result } : null))
      if (errores.imagen) setErrores((prev) => ({ ...prev, imagen: null }))
    }
    reader.readAsDataURL(file)
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    if (!form || !id) return
    setTouched({ titulo: true, descripcion: true, categoria: true, barrio: true, participantes: true, imagen: true })
    const { errores: nextErrores, valido } = validarFormularioIniciativa(form)
    setErrores(nextErrores)
    if (!valido) return

    const categoriaObj = CATEGORIAS_INICIATIVA.find((c) => String(c.id) === String(form.categoria))
    const datos = {
      titulo: form.titulo.trim(),
      descripcion: form.descripcion.trim(),
      categoria: categoriaObj ? categoriaObj.value : form.categoria,
      barrio: form.barrio?.trim() || null,
      participantes: form.participantes ? parseInt(form.participantes, 10) : null,
      imagen: form.imagen || null,
    }
    if (!updatePropuestaStorage(id, datos)) {
      setErrores((prev) => ({ ...prev, submit: 'No se pudo guardar. Intenta de nuevo.' }))
      return
    }
    setGuardado(true)
    setTimeout(() => navigate('/iniciativas/mis-propuestas'), 1200)
  }

  if (propuesta == null || form == null) {
    return (
      <div className="editar-propuesta">
        <SectionHeader title="Editar propuesta" subtitle="Cargando…" />
        <p className="editar-propuesta__loading">Cargando…</p>
      </div>
    )
  }

  return (
    <div className="editar-propuesta postular-iniciativa">
      <SectionHeader
        title="Editar propuesta"
        subtitle="Modifica los datos de tu iniciativa. Los campos con asterisco son obligatorios."
      />

      {guardado && (
        <div className="postular-iniciativa__success" role="alert">
          Cambios guardados. Redirigiendo a Mis propuestas…
        </div>
      )}

      <form className="form-iniciativa" onSubmit={handleSubmit} noValidate>
        {errores.submit && (
          <p className="form-iniciativa__error-global" role="alert">
            {errores.submit}
          </p>
        )}

        <div className="form-iniciativa__field">
          <label htmlFor="editar-titulo" className="form-iniciativa__label">
            Título <span className="form-iniciativa__required">*</span>
          </label>
          <input
            id="editar-titulo"
            name="titulo"
            type="text"
            value={form.titulo}
            onChange={handleChange}
            onBlur={handleBlur}
            placeholder="Ej: Huertas comunitarias en el parque"
            className={`form-iniciativa__input ${errores.titulo ? 'form-iniciativa__input--error' : ''}`}
            maxLength={120}
            autoComplete="off"
            disabled={guardado}
          />
          {touched.titulo && errores.titulo && (
            <span className="form-iniciativa__error">{errores.titulo}</span>
          )}
        </div>

        <div className="form-iniciativa__field">
          <label htmlFor="editar-descripcion" className="form-iniciativa__label">
            Descripción <span className="form-iniciativa__required">*</span>
          </label>
          <textarea
            id="editar-descripcion"
            name="descripcion"
            value={form.descripcion}
            onChange={handleChange}
            onBlur={handleBlur}
            placeholder="Describe tu iniciativa..."
            className={`form-iniciativa__input form-iniciativa__textarea ${errores.descripcion ? 'form-iniciativa__input--error' : ''}`}
            rows={5}
            maxLength={800}
            disabled={guardado}
          />
          <span className="form-iniciativa__hint">{form.descripcion.length}/800</span>
          {touched.descripcion && errores.descripcion && (
            <span className="form-iniciativa__error">{errores.descripcion}</span>
          )}
        </div>

        <div className="form-iniciativa__field">
          <span className="form-iniciativa__label">
            Imagen <span className="form-iniciativa__required">*</span>
          </span>
          <p className="form-iniciativa__hint form-iniciativa__hint--block">
            JPG, PNG o WebP. Máximo 2 MB. Sube una nueva para reemplazar la actual.
          </p>
          <input
            id="editar-imagen"
            name="imagen"
            type="file"
            accept="image/jpeg,image/png,image/webp"
            onChange={handleImageChange}
            className={`form-iniciativa__file ${errores.imagen ? 'form-iniciativa__input--error' : ''}`}
            disabled={guardado}
          />
          {form.imagen && (
            <div className="form-iniciativa__preview">
              <img src={form.imagen} alt="Vista previa" className="form-iniciativa__preview-img" />
            </div>
          )}
          {touched.imagen && errores.imagen && (
            <span className="form-iniciativa__error">{errores.imagen}</span>
          )}
        </div>

        <div className="form-iniciativa__field">
          <label htmlFor="editar-categoria" className="form-iniciativa__label">
            Categoría <span className="form-iniciativa__required">*</span>
          </label>
          <select
            id="editar-categoria"
            name="categoria"
            value={form.categoria}
            onChange={handleChange}
            onBlur={handleBlur}
            className={`form-iniciativa__input form-iniciativa__select ${errores.categoria ? 'form-iniciativa__input--error' : ''}`}
            disabled={guardado}
          >
            <option value="">Selecciona una categoría</option>
            {CATEGORIAS_INICIATIVA.map((c) => (
              <option key={c.id} value={c.id}>
                {c.label}
              </option>
            ))}
          </select>
          {touched.categoria && errores.categoria && (
            <span className="form-iniciativa__error">{errores.categoria}</span>
          )}
        </div>

        <div className="form-iniciativa__field">
          <label htmlFor="editar-barrio" className="form-iniciativa__label">
            Barrio <span className="form-iniciativa__optional">(opcional)</span>
          </label>
          <input
            id="editar-barrio"
            name="barrio"
            type="text"
            value={form.barrio}
            onChange={handleChange}
            onBlur={handleBlur}
            placeholder="Ej: La Soledad, Chapinero Central"
            className={`form-iniciativa__input ${errores.barrio ? 'form-iniciativa__input--error' : ''}`}
            maxLength={80}
            autoComplete="off"
            disabled={guardado}
          />
          {touched.barrio && errores.barrio && (
            <span className="form-iniciativa__error">{errores.barrio}</span>
          )}
        </div>

        <div className="form-iniciativa__field">
          <label htmlFor="editar-participantes" className="form-iniciativa__label">
            Participantes <span className="form-iniciativa__optional">(opcional)</span>
          </label>
          <input
            id="editar-participantes"
            name="participantes"
            type="number"
            min={1}
            max={10000}
            value={form.participantes}
            onChange={handleChange}
            onBlur={handleBlur}
            placeholder="Número estimado"
            className={`form-iniciativa__input ${errores.participantes ? 'form-iniciativa__input--error' : ''}`}
            disabled={guardado}
          />
          {touched.participantes && errores.participantes && (
            <span className="form-iniciativa__error">{errores.participantes}</span>
          )}
        </div>

        <div className="form-iniciativa__actions">
          <button type="submit" className="btn btn--primary" disabled={guardado}>
            Guardar cambios
          </button>
          <Link to="/iniciativas/mis-propuestas" className="btn btn--outline">
            Cancelar
          </Link>
        </div>
      </form>
    </div>
  )
}
