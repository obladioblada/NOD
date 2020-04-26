

export class JoinParameter implements ParameterDto {
    type: parameter.TYPE;
    uriSong: string;

    constructor() {
    }

    unmarshal() {
    }

}

export class Parameter implements ParameterDto {
    type: parameter.TYPE;

    unmarshal() {
    }
}

interface ParameterDto {
    type: TYPE;

    unmarshal();
}
