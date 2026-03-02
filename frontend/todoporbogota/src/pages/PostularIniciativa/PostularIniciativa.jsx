/**
 * Página: Postular una iniciativa para mejorar el barrio.
 * Formulario con validación; sin backend (solo visual).
 * Límite: 1 propuesta por usuario (se comprueba con localStorage).
 */
import { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import SectionHeader from '../../components/SectionHeader/SectionHeader'
import { CATEGORIAS_INICIATIVA, MAX_PROPUESTAS_POR_USUARIO } from '../../data/categoriasIniciativa'
import { validarFormularioIniciativa } from '../../utils/validacionIniciativa'
import { getMisPropuestasStorage } from '../../utils/storageMisPropuestas'
import './PostularIniciativa.css'

const INITIAL_FORM = {
  titulo: '',
  descripcion: '',
  categoria: '',
  barrio: '',
  participantes: '',
  imagen: null, // data URL (base64) al subir archivo
}

export default function PostularIniciativa() {
  const navigate = useNavigate()
  const [form, setForm] = useState(INITIAL_FORM)
  const [errores, setErrores] = useState({})
  const [touched, setTouched] = useState({})
  const [yaTieneUna, setYaTieneUna] = useState(false)
  const [enviado, setEnviado] = useState(false)

  useEffect(() => {
    const propuestas = getMisPropuestasStorage()
    setYaTieneUna(propuestas.length >= MAX_PROPUESTAS_POR_USUARIO)
  }, [])

  const handleChange = (e) => {
    const { name, value } = e.target
    setForm((prev) => ({ ...prev, [name]: value }))
    if (errores[name]) setErrores((prev) => ({ ...prev, [name]: null }))
  }

  const handleBlur = (e) => {
    setTouched((prev) => ({ ...prev, [e.target.name]: true }))
  }

  const handleImageChange = (e) => {
    const file = e.target.files?.[0]
    if (!file) {
      setForm((prev) => ({ ...prev, imagen: null }))
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
      setForm((prev) => ({ ...prev, imagen: reader.result }))
      if (errores.imagen) setErrores((prev) => ({ ...prev, imagen: null }))
    }
    reader.readAsDataURL(file)
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    setTouched({ titulo: true, descripcion: true, categoria: true, barrio: true, participantes: true, imagen: true })
    const { errores: nextErrores, valido } = validarFormularioIniciativa(form)
    setErrores(nextErrores)
    if (!valido) return

    const propuestas = getMisPropuestasStorage()
    if (propuestas.length >= MAX_PROPUESTAS_POR_USUARIO) {
      setYaTieneUna(true)
      setErrores((prev) => ({ ...prev, submit: 'Ya tienes una propuesta postulada. Solo se permite una por usuario.' }))
      return
    }

    const categoriaObj = CATEGORIAS_INICIATIVA.find((c) => String(c.id) === String(form.categoria))
    const fecha = new Date().toISOString()
    const nueva = {
      id: `propuesta-${Date.now()}`,
      titulo: form.titulo.trim(),
      descripcion: form.descripcion.trim(),
      categoria: categoriaObj ? categoriaObj.value : form.categoria,
      barrio: form.barrio?.trim() || null,
      participantes: form.participantes ? parseInt(form.participantes, 10) : null,
      imagen: form.imagen || null,
      fecha,
      estado: 'PENDIENTE',
      historial: [
        { autor: 'usuario', fecha, texto: 'Propuesta enviada para revisión.' },
      ],
    }
    const updated = [...propuestas, nueva]
    try {
      localStorage.setItem('todoporbogota_mis_propuestas', JSON.stringify(updated))
    } catch (err) {
      setErrores((prev) => ({ ...prev, submit: 'No se pudo guardar. Intenta de nuevo.' }))
      return
    }
    setEnviado(true)
    setForm(INITIAL_FORM)
    setErrores({})
    setTouched({})
    setTimeout(() => navigate('/iniciativas/mis-propuestas'), 1200)
  }

  if (yaTieneUna && !enviado) {
    return (
      <div className="postular-iniciativa">
        <SectionHeader
          title="Postular iniciativa"
          subtitle="Propón una iniciativa para mejorar tu barrio."
        />
        <div className="postular-iniciativa__limit">
          <p className="postular-iniciativa__limit-text">
            Ya tienes una propuesta postulada. Por el momento solo se permite <strong>una propuesta por usuario</strong> para asegurar la calidad de las iniciativas.
          </p>
          <Link to="/iniciativas/mis-propuestas" className="btn btn--primary">
            Ver mi propuesta
          </Link>
          <Link to="/iniciativas" className="btn btn--outline">
            Volver a Iniciativas
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="postular-iniciativa">
      <SectionHeader
        title="Postular iniciativa"
        subtitle="Completa el formulario para proponer una iniciativa que mejore tu barrio. Los campos con asterisco son obligatorios."
      />

      {enviado && (
        <div className="postular-iniciativa__success" role="alert">
          Propuesta enviada correctamente. Redirigiendo a Mis propuestas…
        </div>
      )}

      <form className="form-iniciativa" onSubmit={handleSubmit} noValidate>
        {errores.submit && (
          <p className="form-iniciativa__error-global" role="alert">
            {errores.submit}
          </p>
        )}

        <div className="form-iniciativa__field">
          <label htmlFor="titulo" className="form-iniciativa__label">
            Título <span className="form-iniciativa__required">*</span>
          </label>
          <input
            id="titulo"
            name="titulo"
            type="text"
            value={form.titulo}
            onChange={handleChange}
            onBlur={handleBlur}
            placeholder="Ej: Huertas comunitarias en el parque"
            className={`form-iniciativa__input ${errores.titulo ? 'form-iniciativa__input--error' : ''}`}
            maxLength={120}
            autoComplete="off"
            disabled={enviado}
          />
          {touched.titulo && errores.titulo && (
            <span className="form-iniciativa__error">{errores.titulo}</span>
          )}
        </div>

        <div className="form-iniciativa__field">
          <label htmlFor="descripcion" className="form-iniciativa__label">
            Descripción <span className="form-iniciativa__required">*</span>
          </label>
          <textarea
            id="descripcion"
            name="descripcion"
            value={form.descripcion}
            onChange={handleChange}
            onBlur={handleBlur}
            placeholder="Describe tu iniciativa: objetivos, actividades y beneficio para el barrio..."
            className={`form-iniciativa__input form-iniciativa__textarea ${errores.descripcion ? 'form-iniciativa__input--error' : ''}`}
            rows={5}
            maxLength={800}
            disabled={enviado}
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
            JPG, PNG o WebP. Máximo 2 MB. La imagen se mostrará en la tarjeta de la iniciativa.
          </p>
          <input
            id="imagen"
            name="imagen"
            type="file"
            accept="image/jpeg,image/png,image/webp"
            onChange={handleImageChange}
            className={`form-iniciativa__file ${errores.imagen ? 'form-iniciativa__input--error' : ''}`}
            disabled={enviado}
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
          <label htmlFor="categoria" className="form-iniciativa__label">
            Categoría <span className="form-iniciativa__required">*</span>
          </label>
          <select
            id="categoria"
            name="categoria"
            value={form.categoria}
            onChange={handleChange}
            onBlur={handleBlur}
            className={`form-iniciativa__input form-iniciativa__select ${errores.categoria ? 'form-iniciativa__input--error' : ''}`}
            disabled={enviado}
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
          <label htmlFor="barrio" className="form-iniciativa__label">
            Barrio <span className="form-iniciativa__optional">(opcional)</span>
          </label>
          <input
            id="barrio"
            name="barrio"
            type="text"
            value={form.barrio}
            onChange={handleChange}
            onBlur={handleBlur}
            placeholder="Ej: La Soledad, Chapinero Central"
            className={`form-iniciativa__input ${errores.barrio ? 'form-iniciativa__input--error' : ''}`}
            maxLength={80}
            autoComplete="off"
            disabled={enviado}
          />
          {touched.barrio && errores.barrio && (
            <span className="form-iniciativa__error">{errores.barrio}</span>
          )}
        </div>

        <div className="form-iniciativa__field">
          <label htmlFor="participantes" className="form-iniciativa__label">
            Participantes <span className="form-iniciativa__optional">(opcional)</span>
          </label>
          <input
            id="participantes"
            name="participantes"
            type="number"
            min={1}
            max={10000}
            value={form.participantes}
            onChange={handleChange}
            onBlur={handleBlur}
            placeholder="Número estimado"
            className={`form-iniciativa__input ${errores.participantes ? 'form-iniciativa__input--error' : ''}`}
            disabled={enviado}
          />
          {touched.participantes && errores.participantes && (
            <span className="form-iniciativa__error">{errores.participantes}</span>
          )}
        </div>

        <div className="form-iniciativa__actions">
          <button type="submit" className="btn btn--primary" disabled={enviado}>
            Enviar propuesta
          </button>
          <Link to="/iniciativas" className="btn btn--outline">
            Cancelar
          </Link>
        </div>
      </form>
    </div>
  )
}
