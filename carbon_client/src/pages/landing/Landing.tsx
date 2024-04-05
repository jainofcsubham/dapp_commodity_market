import { Header } from '../../components/header/Header'
import "./Landing.css"
import { Hero } from '../../components/hero/Hero'
import { Features } from '../../components/features/Features'
import { Faq } from '../../components/faq/Faq'

export const Landing = () => {
  return (
    <>
        <Header/>
        <Hero/>
        <Features/>
        <Faq />
    </>
  )
}
