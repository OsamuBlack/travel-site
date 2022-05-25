import '../styles/styles.css'
import MobileMenu from './modules/MobileMenu'
import RevealOnScroll from './modules/RevealOnScroll'
import StickeyHeader from './modules/StickeyHeader'

new RevealOnScroll(document.querySelectorAll(".feature-item"), 75)
new RevealOnScroll(document.querySelectorAll(".testimonial"), 60)
new MobileMenu()
new StickeyHeader()
let modal

document.querySelectorAll(".open-modal").forEach(el => {
	el.addEventListener("click", e => {
		e.preventDefault()
		if (typeof modal == "undefined") {
			import(/* webpackChunkName: "modal" */'./modules/Modal').then(x => {
				modal = new x.default()
			}).catch(() => console.log("There was a problem."))
			setTimeout(() => modal.openModal(), 20)
		} else {
			module.openModal()
		}
	})
})

if (module.hot) {
	module.hot.accept()
}
