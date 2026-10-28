export type Pack={id:string;label:string;description:string;questions:string[]};
export const coreQuestions=[
"Quel résultat souhaitez-vous obtenir et pourquoi ?",
"Qu'est-ce qui déclenche ce travail ?",
"Quelles informations ou quels documents utilisez-vous ?",
"Quelles sont les étapes, dans l'ordre réel ?",
"Qui intervient et avec quels outils ?",
"Qu'est-ce qui prend du temps, se répète ou crée des erreurs ?",
"Quelles exceptions ou validations sont indispensables ?",
"Comment saurons-nous qu'une amélioration fonctionne ?"
];
export const packs:Pack[]=[
{id:"ardan",label:"ARDAN — Veille",description:"Découvrir la veille avec les deux collaboratrices, sans supposer leurs outils.",questions:["Quelles sources sont consultées et à quelle fréquence ?","Comment vérifiez-vous une information avant diffusion ?","À qui et sous quelle forme transmettez-vous la veille ?","Montrez-nous un exemple récent de bout en bout."]},
{id:"boulangerie",label:"Boulangerie — Découverte",description:"Identifier les difficultés réelles sans préjuger des processus.",questions:["Comment arrivent les demandes et les commandes ?","Comment organisez-vous production et approvisionnement ?","Quels outils ou supports utilisez-vous aujourd'hui ?","Montrez-nous une tâche qui vous fait perdre du temps."]},
{id:"general",label:"Découverte générale",description:"Un atelier ouvert, adaptable à tous les secteurs.",questions:["Quel exemple concret pourrions-nous observer ?","Qu'avez-vous déjà essayé pour améliorer cette situation ?"]}
];