export function geneateMultiPolygon({ coordinate, count, width, height, gap }) {
    if (!gap) gap = 0;
    if (!width) width = 50;
    if (!height) height = width;

    const coordinates = [];

    for (let i = 0; i < count; i++) {
        coordinates.push(
            generateRectCoordinates({
                coordinate: [coordinate[0], coordinate[1] - gap * i - height * i],
                width,
                height,
            })
        );
    }

    return coordinates;
}

export function generateRectCoordinates({ coordinate, width, height }) {
    if (!width) width = 50;
    if (!height) height = width;
    const rectCoordinates = [
        [coordinate[0], coordinate[1]],
        [coordinate[0] + width, coordinate[1]],
        [coordinate[0] + width, coordinate[1] + height],
        [coordinate[0], coordinate[1] + height],
        [coordinate[0], coordinate[1]],
    ];
    return [rectCoordinates];
}