export default function Button({ href, variant = 'primary', children, ...rest }) {
  const external = href?.startsWith('http')
  return (
    <a href={href} className={`btn btn-${variant}`} {...(external ? { target: '_blank', rel: 'noopener noreferrer' } : {})} {...rest}>
      {children}
    </a>
  )
}
