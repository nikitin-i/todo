const listsTemplate = `
{{#lists}}
    <li class="lists__item" id="{{id}}">
        <span class="lists__icon"></span>
        <span class="lists__text">{{list}}</span>
        <span class="lists__amount">{{amount}}</span>
    </li>
{{/lists}}
`;

export default listsTemplate;